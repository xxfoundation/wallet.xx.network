// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveEraPrefs, DeriveSessionInfo, DeriveStakingElected, DeriveStakingQuery, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import type { Compact, Option, u32, u128 } from '@polkadot/types';
import type { SortedTargets, TargetSortBy, ValidatorInfo } from './types';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useApi, useCall, useCallMulti, useInflation } from '@polkadot/react-hooks';
import { PalletStakingExposure } from '@polkadot/types/lookup';
import { arrayFlatten, BN, BN_HUNDRED, BN_MAX_INTEGER, BN_ONE, BN_ZERO } from '@polkadot/util';
import { DeriveEraPoints } from '@polkadot/api-derive/types';

import useTeamMultipliers, { TeamMultipliers } from './useTeamMultipliers';

interface LastEra {
  activeEra: BN;
  eraLength: BN;
  lastEras: BN[];
  sessionLength: BN;
}

interface MultiResult {
  counterForNominators?: BN;
  counterForValidators?: BN;
  historyDepth?: BN;
  maxNominatorsCount?: BN;
  maxValidatorsCount?: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  totalIssuance?: BN;
}

// Interface overrides to get custody from exposure
interface PalletStakingExposureWithCustody extends PalletStakingExposure {
  custody: Compact<u128>;
}

interface DeriveStakingQueryWithCustody extends DeriveStakingQuery {
  exposure: PalletStakingExposureWithCustody;
}

interface DeriveStakingElectedWithCustody extends DeriveStakingElected {
  info: DeriveStakingQueryWithCustody[];
}

interface DeriveStakingWaitingWithCustody extends DeriveStakingWaiting {
  info: DeriveStakingQueryWithCustody[];
}

const EMPTY_PARTIAL: Partial<SortedTargets> = {};
const DEFAULT_FLAGS_ELECTED = { withController: true, withExposure: true, withPrefs: true };
const DEFAULT_FLAGS_WAITING = { withController: true, withPrefs: true };

function mapIndex(mapBy: TargetSortBy): (info: ValidatorInfo, index: number) => ValidatorInfo {
  return (info, index): ValidatorInfo => {
    info[mapBy] = index + 1;

    return info;
  };
}

function isWaitingDerive(derive: DeriveStakingElectedWithCustody | DeriveStakingWaitingWithCustody): derive is DeriveStakingWaitingWithCustody {
  return !(derive as DeriveStakingElectedWithCustody).nextElected;
}

function sortValidators(list: ValidatorInfo[]): ValidatorInfo[] {
  const existing: string[] = [];

  return list
    .filter((a): boolean => {
      const s = a.accountId.toString();

      if (!existing.includes(s)) {
        existing.push(s);

        return true;
      }

      return false;
    })
    // .filter((a) => a.bondTotal.gtn(0))
    // ignored, not used atm
    .sort((a, b) => b.commissionPer - a.commissionPer)
    .map(mapIndex('rankComm'))
    .sort((a, b) => b.bondOther.cmp(a.bondOther))
    .map(mapIndex('rankBondOther'))
    .sort((a, b) => b.bondOwn.cmp(a.bondOwn))
    .map(mapIndex('rankBondOwn'))
    .sort((a, b) => b.bondTotalWithTM.cmp(a.bondTotalWithTM))
    .map(mapIndex('rankBondTotal'))
    .sort((a, b) => b.predictedStake.cmp(a.predictedStake))
    .map(mapIndex('rankPredictedStake'))
    // .sort((a, b) => b.validatorPayment.cmp(a.validatorPayment))
    // .map(mapIndex('rankPayment'))
    .sort((a, b) => a.stakedReturnCmp - b.stakedReturnCmp)
    .map(mapIndex('rankReward'))
    // ignored, not used atm
    // .sort((a, b) => b.numNominators - a.numNominators)
    // .map(mapIndex('rankNumNominators'))
    .sort((a, b) => b.teamMultiplier.cmp(a.teamMultiplier))
    .map(mapIndex('rankTeamMultiplier'))
    .sort((a, b) =>
      (b.stakedReturnCmp - a.stakedReturnCmp) ||
      (a.commissionPer - b.commissionPer) ||
      (b.rankBondTotal - a.rankBondTotal)
    )
    .map(mapIndex('rankOverall')).sort((a, b) =>
      (b.nominatingAccounts.length - a.nominatingAccounts.length)
    )
    .map(mapIndex('rankNumNominators'))
    .sort((a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : (a.isFavorite ? -1 : 1)
    );
}

function extractSingle(api: ApiPromise, allAccounts: string[], custodyRewardsActive: boolean, derive: DeriveStakingElectedWithCustody | DeriveStakingWaitingWithCustody, favorites: string[], { activeEra, eraLength, lastEras, sessionLength }: LastEra, historyDepth?: BN, withReturns?: boolean, teamMultipliers?: TeamMultipliers, erasPrefs?: DeriveEraPrefs[]): [ValidatorInfo[], Record<string, BN>] {
  const nominators: Record<string, BN> = {};
  const lastEra = lastEras.length ? lastEras[lastEras.length-1] : BN_ZERO;
  const earliestEra = historyDepth && lastEra.sub(historyDepth).iadd(BN_ONE);
  const list = derive.info.map(({ accountId, cmixId, exposure, stakingLedger, validatorPrefs }): ValidatorInfo => {
    // some overrides (e.g. Darwinia Crab) does not have the own/total field in Exposure
    let [bondOwn, bondTotal] = exposure.total
      ? [exposure.own.unwrap(), exposure.total.unwrap()]
      : [BN_ZERO, BN_ZERO];
    const skipRewards = bondTotal.isZero();
    // some overrides (e.g. Darwinia Crab) does not have the value field in IndividualExposure
    const minNominated = (exposure.others || []).reduce((min: BN, { value = api.createType('Compact<Balance>') }): BN => {
      const actual = value.unwrap();

      return min.isZero() || actual.lt(min)
        ? actual
        : min;
    }, BN_ZERO);

    if (bondTotal.isZero()) {
      bondTotal = bondOwn = stakingLedger.total?.unwrap() || BN_ZERO;
    }

    const key = accountId.toString();
    const lastEraPayout = !lastEra.isZero()
      ? stakingLedger.claimedRewards[stakingLedger.claimedRewards.length - 1]
      : undefined;

    // only use if it is more recent than historyDepth
    let lastPayout: BN | undefined = earliestEra && lastEraPayout && lastEraPayout.gt(earliestEra)
      ? lastEraPayout
      : undefined;

    if (lastPayout && !sessionLength.eq(BN_ONE)) {
      lastPayout = lastEra.sub(lastPayout).mul(eraLength);
    }

    const validatorNominators = (exposure.others || []).map((indv) => indv.who.toString());
    const ownNominatingAccounts = validatorNominators.filter((id) => allAccounts.includes(id));
    const currEraPrefs = erasPrefs && erasPrefs[erasPrefs.length-1];
    const commission = (!isWaitingDerive(derive) && currEraPrefs?.validators[key]) ? currEraPrefs?.validators[key].commission : validatorPrefs.commission;
    const commissionPer = validatorPrefs.commission.unwrap().toNumber() / 10_000_000;
    const pastCommissions: number[] = [];
    erasPrefs?.forEach((eraPrefs) => {
      const comm = eraPrefs.validators[key] && eraPrefs.validators[key].commission.unwrap().toNumber() / 10_000_000;
      if (comm) {
        pastCommissions.push(comm);
      }
    });
    const pastAvgCommission = pastCommissions.length ? pastCommissions.reduce((total, num) => total + num, 0.0) / pastCommissions.length : commissionPer;
    const isCommissionReducing = commissionPer < (pastAvgCommission - 20);

    const teamMultiplier = (teamMultipliers && teamMultipliers[key]) || BN_ZERO;
    const bondTotalWithTM = custodyRewardsActive ? bondTotal.add(teamMultiplier) : bondTotal;
    const electedMultiplier = (custodyRewardsActive && !skipRewards) ? exposure.custody.unwrap() : BN_ZERO;
    const electedStake = skipRewards ? BN_ZERO : bondTotal.add(electedMultiplier);

    return {
      accountId,
      bondOther: bondTotal.sub(bondOwn),
      bondOwn,
      bondShare: 0,
      bondTotal,
      bondTotalWithTM,
      electedStake,
      predictedStake: BN_ZERO,
      cmixId,
      commission,
      commissionPer,
      pastAvgCommission,
      isCommissionReducing,
      exposure,
      isActive: !skipRewards,
      isBlocking: !!(validatorPrefs.blocked && validatorPrefs.blocked.isTrue),
      isElected: !isWaitingDerive(derive) && derive.nextElected.some((e) => e.eq(accountId)),
      isFavorite: favorites.includes(key),
      isNominating: (exposure.others || []).reduce((isNominating, indv): boolean => {
        const nominator = indv.who.toString();

        nominators[nominator] = (nominators[nominator] || BN_ZERO).add(indv.value?.toBn() || BN_ZERO);

        return isNominating || allAccounts.includes(nominator);
      }, allAccounts.includes(key)),
      key,
      knownLength: activeEra.sub(stakingLedger.claimedRewards[0] || activeEra),
      lastPayout,
      minNominated,
      nominatingAccounts: ownNominatingAccounts,
      numNominators: (exposure.others || []).length,
      numRecentPayouts: earliestEra
        ? stakingLedger.claimedRewards.filter((era) => era.gte(earliestEra)).length
        : 0,
      rankBondOther: 0,
      rankBondOwn: 0,
      rankBondTotal: 0,
      rankPredictedStake: 0,
      rankComm: 0,
      rankNumNominators: 0,
      rankOverall: 0,
      rankReward: 0,
      rankTeamMultiplier: 0,
      skipRewards,
      stakedReturn: 0,
      stakedReturnCmp: 0,
      teamMultiplier,
      validatorPrefs,
      withReturns
    };
  });

  return [list, nominators];
}

function addReturns(inflation: { stakedReturn: number }, baseInfo: Partial<SortedTargets>, lastErasPoints: DeriveEraPoints[]): Partial<SortedTargets> {
  const avgStaked = baseInfo.avgStakedWithTM;
  const validators = baseInfo.validators;
  const avgPoints = lastErasPoints.map(( { eraPoints, validators }) => {
    const len = Object.keys(validators).length;
    return len ? eraPoints.toNumber() / len : 1.0
  });

  if (!validators) {
    return baseInfo;
  }

  avgStaked && !avgStaked.isZero() && validators.forEach((v): void => {
    const denom = v.predictedElected === undefined ? v.bondTotalWithTM : v.predictedStake;
    const adjusted = denom.isZero() ? BN_ZERO : avgStaked.mul(BN_HUNDRED).imuln(inflation.stakedReturn).div(denom);
    const performance: number[] = [];
    avgPoints.forEach((avg, index) => {
      const points = lastErasPoints[index].validators[v.accountId.toString()];
      points && performance.push(points.toNumber() / avg);
    });
    const avgPerformance = performance.length ? performance.reduce((sum, val) => sum + val, 0) / performance.length : 1.0;

    // in some cases, we may have overflows... protect against those
    v.stakedReturn = (adjusted.gt(BN_MAX_INTEGER) ? BN_MAX_INTEGER : adjusted).toNumber() / BN_HUNDRED.toNumber();
    v.stakedReturnCmp = v.stakedReturn * avgPerformance * (100 - v.commissionPer) / 100;
  });

  return { ...baseInfo, validators: sortValidators(validators) };
}

function extractBaseInfo(api: ApiPromise, allAccounts: string[], custodyRewardsActive: boolean, electedDerive: DeriveStakingElectedWithCustody, waitingDerive: DeriveStakingWaitingWithCustody, favorites: string[], totalIssuance: BN, lastEraInfo: LastEra, historyDepth?: BN, teamMultipliers?: TeamMultipliers, erasPrefs?: DeriveEraPrefs[]): Partial<SortedTargets> {
  const [elected, nominators] = extractSingle(api, allAccounts, custodyRewardsActive, electedDerive, favorites, lastEraInfo, historyDepth, true, teamMultipliers, erasPrefs);
  const [waiting] = extractSingle(api, allAccounts, custodyRewardsActive, waitingDerive, favorites, lastEraInfo, undefined, undefined, teamMultipliers, erasPrefs);
  // Active real stake
  const activeTotals = elected
    .filter(({ isActive }) => isActive)
    .map(({ bondTotal }) => bondTotal)
    .sort((a, b) => a.cmp(b));
  // Total real stake
  const totalStaked = activeTotals.reduce((total: BN, value) => total.iadd(value), new BN(0));
  // Total (live) multipliers
  const totalTeamMultipliers = teamMultipliers ? teamMultipliers && Object.values(teamMultipliers).reduce((total, val) => total.add(val), BN_ZERO) : BN_ZERO;
  // Average staked with live TM (used for return computation)
  const avgStakedWithTM = totalStaked.add(totalTeamMultipliers).divn(activeTotals.length);

  // Active elected stake (real + elected multiplier)
  const electedTotals = elected
  .filter(({ isActive }) => isActive)
  .map(({ electedStake }) => electedStake)
  .sort((a, b) => a.cmp(b));
  // Average elected stake
  const electedAvgStaked = electedTotals.reduce((total: BN, value) => total.iadd(value), new BN(0)).divn(electedTotals.length);

  // all validators, calc median commission
  const minNominated = Object.values(nominators).reduce((min: BN, value) => {
    return min.isZero() || value.lt(min)
      ? value
      : min;
  }, BN_ZERO);
  const validators = arrayFlatten([elected, waiting]);
  const commValues = validators.map(({ commissionPer }) => commissionPer).sort((a, b) => a - b);
  const midIndex = Math.floor(commValues.length / 2);
  const medianComm = commValues.length
    ? commValues.length % 2
      ? commValues[midIndex]
      : (commValues[midIndex - 1] + commValues[midIndex]) / 2
    : 0;

  // ids
  const waitingIds = waiting.map(({ key }) => key);
  const validatorIds = arrayFlatten([
    elected.map(({ key }) => key),
    waitingIds
  ]);
  const nominateIds = arrayFlatten([
    elected.filter(({ isBlocking }) => !isBlocking).map(({ key }) => key),
    waiting.filter(({ isBlocking }) => !isBlocking).map(({ key }) => key)
  ]);

  return {
    avgStakedWithTM,
    electedAvgStaked,
    electedLowStaked: electedTotals[0] || BN_ZERO,
    medianComm,
    minNominated,
    nominateIds,
    nominators: Object.keys(nominators),
    totalIssuance,
    totalStaked,
    validatorIds,
    validators,
    waitingIds
  };
}

const transformEra = {
  transform: ({ activeEra, eraLength, sessionLength }: DeriveSessionInfo): LastEra => {
    const firstEra = activeEra.toNumber() < 7 ? BN_ZERO : activeEra.subn(7);
    const lastEra = activeEra.isZero() ? BN_ZERO : activeEra.subn(1);
    const lastEras: BN[] = [];
    for (let era = firstEra; era.lte(lastEra); era = era.addn(1)) {
      lastEras.push(era);
    }
    return {
      activeEra,
      eraLength,
      lastEras,
      sessionLength
    }
  }
};

const transformMulti = {
  defaultValue: {},
  transform: ([historyDepth, counterForNominators, counterForValidators, optMaxNominatorsCount, optMaxValidatorsCount, minNominatorBond, minValidatorBond, totalIssuance]: [BN, BN?, BN?, Option<u32>?, Option<u32>?, BN?, BN?, BN?]): MultiResult => ({
    counterForNominators,
    counterForValidators,
    historyDepth,
    maxNominatorsCount: optMaxNominatorsCount && optMaxNominatorsCount.isSome
      ? optMaxNominatorsCount.unwrap()
      : undefined,
    maxValidatorsCount: optMaxValidatorsCount && optMaxValidatorsCount.isSome
      ? optMaxValidatorsCount.unwrap()
      : undefined,
    minNominatorBond,
    minValidatorBond,
    totalIssuance
  })
};

function useSortedTargetsImpl(favorites: string[]): SortedTargets {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const { counterForNominators, counterForValidators, historyDepth, maxNominatorsCount, maxValidatorsCount, minNominatorBond, minValidatorBond, totalIssuance } = useCallMulti<MultiResult>([
    api.query.staking.historyDepth,
    api.query.staking.counterForNominators,
    api.query.staking.counterForValidators,
    api.query.staking.maxNominatorsCount,
    api.query.staking.maxValidatorsCount,
    api.query.staking.minNominatorBond,
    api.query.staking.minValidatorBond,
    api.query.balances?.totalIssuance
  ], transformMulti);
  const electedInfo = useCall<DeriveStakingElectedWithCustody>(api.derive.staking.electedInfo, [{ ...DEFAULT_FLAGS_ELECTED, withLedger: true }]);
  const waitingInfo = useCall<DeriveStakingWaitingWithCustody>(api.derive.staking.waitingInfo, [{ ...DEFAULT_FLAGS_WAITING, withLedger: true }]);
  const lastEraInfo = useCall<LastEra>(api.derive.session.info, undefined, transformEra);
  const lastErasPoints = useCall<DeriveEraPoints[]>(lastEraInfo?.lastEras && api.derive.staking._erasPoints, [lastEraInfo?.lastEras, false]);
  const teamNominations = useTeamMultipliers();
  const eras = (lastEraInfo && lastEraInfo.lastEras.length > 1) ? lastEraInfo?.lastEras.slice(1).concat(lastEraInfo?.activeEra) : [lastEraInfo?.activeEra];
  const erasPrefs = useCall<DeriveEraPrefs[]>(api.derive.staking._erasPrefs, [eras, false]);

  const custodyRewardsActive = electedInfo ? ('custody' in electedInfo.info[0].exposure) : false;
  const totalTeamMultipliers = custodyRewardsActive ? teamNominations && Object.values(teamNominations).reduce((total, val) => total.add(val), BN_ZERO) : BN_ZERO;

  const baseInfo = useMemo(
    () => electedInfo && lastEraInfo && totalIssuance && waitingInfo && teamNominations
      ? extractBaseInfo(api, allAccounts, custodyRewardsActive, electedInfo, waitingInfo, favorites, totalIssuance, lastEraInfo, historyDepth, teamNominations, erasPrefs)
      : EMPTY_PARTIAL,
    [electedInfo, lastEraInfo, totalIssuance, waitingInfo, teamNominations, api, allAccounts, custodyRewardsActive, favorites, historyDepth, erasPrefs]
  );

  const inflation = useInflation(baseInfo?.totalStaked, totalTeamMultipliers);

  const partial = useMemo(
    () => inflation && inflation.stakedReturn && lastErasPoints
      ? addReturns(inflation, baseInfo, lastErasPoints)
      : baseInfo,
    [baseInfo, inflation, lastErasPoints]
  );

  return {
    counterForNominators,
    counterForValidators,
    custodyRewardsActive,
    inflation,
    maxNominatorsCount,
    maxValidatorsCount,
    medianComm: 0,
    minNominated: BN_ZERO,
    minNominatorBond,
    minValidatorBond,
    ...partial
  };
}

export default createNamedHook('useSortedTargets', useSortedTargetsImpl);
