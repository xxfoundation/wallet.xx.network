// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHasIdentity, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { u32 } from '@polkadot/types-codec';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets, TargetSortBy, ValidatorInfo } from '../types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, Icon, PaginationAdvanced, Table, Toggle } from '@polkadot/react-components';
import { useApi, useAvailableSlashes, useBlocksPerDays, usePagination, useSavedFlags } from '@polkadot/react-hooks';
import { BN_HUNDRED, BN_ZERO } from '@polkadot/util';

import { MAX_NOMINATIONS } from '../constants';
import ElectionBanner from '../ElectionBanner';
import Filtering from '../Filtering';
import Legend from '../Legend';
import { useTranslation } from '../translate';
import useIdentities from '../useIdentities';
import Nominate from './Nominate';
import StashFilters from './StashFilters';
import Summary from './Summary';
import useOwnNominators from './useOwnNominators';
import Validator from './Validator';
import useElectionPrediction from '../useElectionPrediction';

interface Props {
  className?: string;
  isInElection: boolean;
  nominatedBy?: NominatedByMap;
  ownStashes?: StakerState[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  ownNominators: StakerState[];
  toggleNominatedBy: () => void;
}

interface SavedFlags {
  withElected: boolean;
  withGroup: boolean;
  withIdentity: boolean;
  withPayout: boolean;
  withoutComm: boolean;
  withoutOver: boolean;
  withAccountNominations: boolean;
}

interface Flags extends SavedFlags {
  daysPayout: BN;
  isBabe: boolean;
  maxPaid: BN | undefined;
}

interface SortState {
  sortBy: TargetSortBy;
  sortFromMax: boolean;
}

const CLASSES: Record<string, string> = {
  rankBondOther: 'is-tertiary',
  rankBondOwn: 'highlight--color',
  rankTeamMultiplier: 'is-secondary'
};
const MAX_CAP_PERCENT = 100; // 75 if only using numNominators
const MAX_COMM_PERCENT = 10; // -1 for median
const MAX_DAYS = 7;
const SORT_KEYS = ['rankComm', 'rankTeamMultiplier', 'rankBondOwn', 'rankBondOther', 'rankBondTotal', 'rankPredictedStake', 'rankOverall'];

function overlapsDisplay (displays: (string[])[], test: string[]): boolean {
  return displays.some((d) =>
    d.length === test.length
      ? d.length === 1
        ? d[0] === test[0]
        : d.reduce((c, p, i) => c + (p === test[i] ? 1 : 0), 0) >= (test.length - 1)
      : false
  );
}

function applyFilter (validators: ValidatorInfo[], medianComm: number, allIdentity: Record<string, DeriveHasIdentity>, { daysPayout, isBabe, maxPaid, withAccountNominations, withElected, withGroup, withIdentity, withPayout, withoutComm, withoutOver }: Flags, nominatedBy?: NominatedByMap, stashIds?: string[]): ValidatorInfo[] {
  const displays: (string[])[] = [];
  const parentIds: string[] = [];

  return validators.filter(({ accountId, commissionPer, isElected, isFavorite, lastPayout, nominatingAccounts, numNominators }): boolean => {
    if (isFavorite) {
      return true;
    }

    const stashId = accountId.toString();
    const thisIdentity = allIdentity[stashId];
    const nomCount = numNominators || nominatedBy?.[stashId]?.length || 0;

    if (
      (!withAccountNominations || nominatingAccounts.length > 0) &&
      (!withAccountNominations || !stashIds || stashIds.length === 0 || stashIds.some((id) => nominatingAccounts?.includes(id))) &&
      (!withElected || isElected) &&
      (!withIdentity || !!thisIdentity?.hasIdentity) &&
      (!withPayout || !isBabe || (!!lastPayout && daysPayout.gte(lastPayout))) &&
      (!withoutComm || (
        MAX_COMM_PERCENT > 0
          ? (commissionPer <= MAX_COMM_PERCENT)
          : (!medianComm || (commissionPer <= medianComm)))
      ) &&
      (!withoutOver || !maxPaid || maxPaid.muln(MAX_CAP_PERCENT).div(BN_HUNDRED).gten(nomCount))
    ) {
      if (!withGroup) {
        return true;
      } else if (!thisIdentity || !thisIdentity.hasIdentity) {
        parentIds.push(stashId);

        return true;
      } else if (!thisIdentity.parentId) {
        if (!parentIds.includes(stashId)) {
          if (thisIdentity.display) {
            const sanitized = thisIdentity.display
              .replace(/[^\x20-\x7E]/g, '')
              .replace(/-/g, ' ')
              .replace(/_/g, ' ')
              .split(' ')
              .map((p) => p.trim())
              .filter((v) => !!v);

            if (overlapsDisplay(displays, sanitized)) {
              return false;
            }

            displays.push(sanitized);
          }

          parentIds.push(stashId);

          return true;
        }
      } else if (!parentIds.includes(thisIdentity.parentId)) {
        parentIds.push(thisIdentity.parentId);

        return true;
      }
    }

    return false;
  });
}

function sort (sortBy: TargetSortBy, sortFromMax: boolean, validators: ValidatorInfo[]): ValidatorInfo[] {
  // Use slice to create new array, so that sorting triggers component render
  return validators
    .slice(0)
    .sort((a, b) =>
      sortFromMax
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy]
    )
    .sort((a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : (a.isFavorite ? -1 : 1)
    );
}

function extractNominees (ownNominators: StakerState[] = []): string[] {
  const myNominees: string[] = [];

  ownNominators.forEach(({ nominating = [] }: StakerState): void => {
    nominating.forEach((nominee: string): void => {
      !myNominees.includes(nominee) &&
        myNominees.push(nominee);
    });
  });

  return myNominees;
}

function selectProfitable (list: ValidatorInfo[], maxNominations: number): string[] {
  const result: string[] = [];

  for (let i = 0; i < list.length && result.length < maxNominations; i++) {
    const { isBlocking, isFavorite, key, stakedReturnCmp } = list[i];

    (!isBlocking && (isFavorite || (stakedReturnCmp > 0))) &&
      result.push(key);
  }

  return result;
}

const DEFAULT_FLAGS = {
  withAccountNominations: false,
  withElected: false,
  withGroup: true,
  withIdentity: false,
  withPayout: false,
  withoutComm: true,
  withoutOver: true
};

const DEFAULT_NAME = { isQueryFiltered: false, nameFilter: '' };

const DEFAULT_SORT: SortState = { sortBy: 'rankNumNominators', sortFromMax: true };

function Targets ({ className = '', isInElection, nominatedBy, ownStashes, targets: { electedAvgStaked, inflation: { stakedReturn }, lastEra, custodyRewardsActive, electedLowStaked, medianComm, minNominated, minNominatorBond, nominators, totalIssuance, totalStaked, validatorIds, validators }, toggleFavorite, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const allSlashes = useAvailableSlashes();
  const daysPayout = useBlocksPerDays(MAX_DAYS);
  const ownNominators = useOwnNominators(ownStashes);
  const allIdentity = useIdentities(validatorIds);
  const [selected, setSelected] = useState<string[]>([]);
  const [{ isQueryFiltered, nameFilter }, setNameFilter] = useState(DEFAULT_NAME);
  const [toggles, setToggle] = useSavedFlags('staking:targets', DEFAULT_FLAGS);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortState>(DEFAULT_SORT);
  const [sorted, setSorted] = useState<ValidatorInfo[] | undefined>();

  const ownStashIds = ownStashes?.map(({ stashId }) => stashId);
  const [stashFilters, setStashFilters] = useState<string[] | undefined>();

  useEffect(() => {
    if (toggles.withAccountNominations === false) {
      setStashFilters([]);
    }
  }, [setStashFilters, toggles]);

  const labelsRef = useRef({
    rankBondOther: t<string>('other stake'),
    rankBondOwn: t<string>('own stake'),
    rankBondTotal: t<string>('total stake'),
    rankPredictedStake: t<string>('predicted stake'),
    rankComm: t<string>('commission'),
    rankOverall: t<string>('return'),
    rankTeamMultiplier: t<string>('team multiplier')
  });

  const flags = useMemo(
    () => ({
      ...toggles,
      daysPayout,
      isBabe: !!api.consts.babe,
      isQueryFiltered,
      maxPaid: api.consts.staking?.maxNominatorRewardedPerValidator
    }),
    [api, daysPayout, isQueryFiltered, toggles]
  );

  const filtered = useMemo(
    () => allIdentity && validators && nominatedBy &&
      applyFilter(validators, medianComm, allIdentity, flags, nominatedBy, stashFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allIdentity, flags, medianComm, nominatedBy, validators, stashFilters?.join('')]
  );

  // We are using an effect here to get this async. Sorting will have a double-render, however it allows
  // the page to immediately display (with loading), whereas useMemo would have a laggy interface
  // (the same applies for changing the sort order, state here is more effective)
  useEffect((): void => {
    filtered && setSorted(
      sort(sortBy, sortFromMax, filtered)
    );
  }, [filtered, sortBy, sortFromMax]);

  useEffect((): void => {
    toggleNominatedBy();
  }, [toggleNominatedBy]);

  const maxNominations = useMemo(
    () => api.consts.staking.maxNominations
      ? (api.consts.staking.maxNominations as u32).toNumber()
      : MAX_NOMINATIONS,
    [api]
  );

  const myNominees = useMemo(
    () => extractNominees(ownNominators),
    [ownNominators]
  );

  const electionPrediction = useElectionPrediction(ownNominators);

  useEffect(() => {
    if (electionPrediction && validators) {
      validators.forEach((value) => {
        const key = value.accountId.toString();
        value.predictedStake = (key in electionPrediction && electionPrediction[key][1]) || BN_ZERO;
        value.predictedElected = (key in electionPrediction && electionPrediction[key][0]) || false;
      })
    }
  }, [electionPrediction, validators]);

  const _sort = useCallback(
    (sortBy: TargetSortBy) => setSortBy((p) => ({
      sortBy,
      sortFromMax: sortBy === p.sortBy
        ? !p.sortFromMax
        : true
    })),
    []
  );

  const _toggleSelected = useCallback(
    (address: string) => setSelected(
      selected.includes(address)
        ? selected.filter((a) => address !== a)
        : [...selected, address]
    ),
    [selected]
  );

  const _selectProfitable = useCallback(
    () => filtered && setSelected(
      selectProfitable(filtered, maxNominations)
    ),
    [filtered, maxNominations]
  );

  const _setNameFilter = useCallback(
    (nameFilter: string, isQueryFiltered: boolean) => setNameFilter({ isQueryFiltered, nameFilter }),
    []
  );

  const header = useMemo(() => [
    [t('validators'), 'start', 3],
    [t('nominators'), 'media--1200', 2],
    [t('cmix id')],
    [t('location')],
    ...(SORT_KEYS as (keyof typeof labelsRef.current)[]).map((header) => [
      <>{labelsRef.current[header]}<Icon icon={sortBy === header ? (sortFromMax ? 'chevron-down' : 'chevron-up') : 'minus'} /></>,
      `${sorted ? `isClickable ${sortBy === header ? 'highlight--border' : ''} number` : 'number'} ${CLASSES[header] || ''}`,
      1,
      () => _sort(header as 'rankOverall')
    ]),
    [t('select')],
    [t('stats')]
  ], [_sort, labelsRef, sortBy, sorted, sortFromMax, t]);

  const tooltipNominators = useMemo(() => <div>
    {t<string>('Left Column is the number of active nominators.')}<br/>
    {t<string>('Right Column is the number of nominators for the next era.')}<br/>
  </div>, [t]);

  const tooltipPredictedStake = useMemo(() => <div>
    {t<string>('Predicted stake is computed using the Phragmen algorithm.')}<br/>
    {t<string>('Validators that will be elected are shown in green.')}<br/>
    {t<string>('From 7PM to 11PM UTC (election period), predictions are based on the on-chain snapshot of Staking state.')}
  </div>, [t]);

  const tooltipReturn = useMemo(() => <div>
    {t<string>('Return calculation uses predicted stake and validators\' last era points.')}
  </div>, [t]);

  const filter = useMemo(() => (
    <div>
      <Filtering
        nameFilter={nameFilter}
        setNameFilter={_setNameFilter}
        setWithIdentity={setToggle.withIdentity}
        withIdentity={toggles.withIdentity}
      >
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('one validator per operator')}
          onChange={setToggle.withGroup}
          value={toggles.withGroup}
        />
        <Toggle
          className='staking--buttonToggle'
          label={
            MAX_COMM_PERCENT > 0
              ? t<string>('comm. <= {{maxComm}}%', { replace: { maxComm: MAX_COMM_PERCENT } })
              : t<string>('comm. <= median')
          }
          onChange={setToggle.withoutComm}
          value={toggles.withoutComm}
        />
        <Toggle
          className='staking--buttonToggle'
          label={
            MAX_CAP_PERCENT < 100
              ? t<string>('capacity < {{maxCap}}%', { replace: { maxCap: MAX_CAP_PERCENT } })
              : t<string>('with capacity')
          }
          onChange={setToggle.withoutOver}
          value={toggles.withoutOver}
        />
        {api.consts.babe && (
          // FIXME have some sane era defaults for Aura
          <Toggle
            className='staking--buttonToggle'
            label={t<string>('recent payouts')}
            onChange={setToggle.withPayout}
            value={toggles.withPayout}
          />
        )}
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('currently elected')}
          onChange={setToggle.withElected}
          value={toggles.withElected}
        />
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('your nominations')}
          onChange={setToggle.withAccountNominations}
          value={toggles.withAccountNominations}
        />
      </Filtering>
    </div>
  ), [api, nameFilter, _setNameFilter, setToggle, t, toggles]);

  const displayList = isQueryFiltered
    ? validators
    : sorted;

  const paginated = usePagination(displayList, { perPage: 50 });
  const finalList = nameFilter ? displayList : paginated.items;
  const canSelect = selected.length < maxNominations;

  return (
    <div className={className}>
      <Summary
        avgStaked={electedAvgStaked}
        custodyRewardsActive={custodyRewardsActive}
        lowStaked={electedLowStaked}
        lastEra={lastEra}
        minNominated={minNominated}
        minNominatorBond={minNominatorBond}
        numNominators={nominators?.length}
        numValidators={validators?.length}
        stakedReturn={stakedReturn}
        totalIssuance={totalIssuance}
        totalStaked={totalStaked}
      />
      <Button.Group>
        <Button
          icon='check'
          isDisabled={!validators?.length || !ownNominators?.length}
          label={t<string>('Most profitable')}
          onClick={_selectProfitable}
        />
        <Nominate
          isDisabled={isInElection || !validators?.length}
          ownNominators={ownNominators}
          targets={selected}
        />
      </Button.Group>
      <ElectionBanner isInElection={isInElection} />
      <Table
        empty={displayList && t<string>('No active validators to check')}
        emptySpinner={
          <>
            {!(validators && allIdentity) && <div>{t('Retrieving validators')}</div>}
            {!nominatedBy && <div>{t('Retrieving nominators')}</div>}
            {!displayList && <div>{t('Preparing target display')}</div>}
          </>
        }
        filter={<>
          {filter}
          {toggles.withAccountNominations && ownStashIds && ownStashIds.length > 0 && (
            <StashFilters
              available={ownStashIds}
              onChange={setStashFilters}
            />
          )}
        </>}
        header={header}
        help={[tooltipNominators, tooltipPredictedStake, tooltipReturn]}
        helpHeader={['nominators', header[9][0], header[10][0]]}
        legend={<Legend />}
      >
        {finalList?.map((info): React.ReactNode =>
          <Validator
            allSlashes={allSlashes}
            canSelect={canSelect}
            filterName={nameFilter}
            info={info}
            isNominated={myNominees.includes(info.key)}
            isSelected={selected.includes(info.key)}
            key={info.key}
            nominatedBy={nominatedBy?.[info.key]}
            toggleFavorite={toggleFavorite}
            toggleSelected={_toggleSelected}
          />
        )}
      </Table>
      {!nameFilter && <PaginationAdvanced {...paginated} />}
    </div>
  );
}

export default React.memo(styled(Targets)`
  text-align: center;

  th.isClickable {
    .ui--Icon {
      margin-left: 0.5rem;
    }
  }

  .ui--Table {
    overflow-x: auto;
  }
`);
