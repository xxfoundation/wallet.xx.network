// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Inflation } from './types';

import { useMemo } from 'react';

import { BN_MILLION } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useIdealInterest } from './useIdealInterest';
import { InflationParams, useInflationParams } from './useInflationParams';
import { useTotalStakeableIssuance } from './useTotalStakeableIssuance';

function calcInflation (inflationParams: InflationParams, totalStaked: BN, totalStakeableIssuance: BN, idealInterest: BN, totalTeamMultipliers: BN) {
  const { falloff, idealStake, minInflation } = inflationParams;
  const stakedFraction = totalStaked.isZero() || totalStakeableIssuance.isZero()
    ? 0
    : totalStaked.mul(BN_MILLION).div(totalStakeableIssuance).toNumber() / BN_MILLION.toNumber();
  const idealInterestNumber = idealInterest.toNumber() / 1e9;

  const inflation = 100 * (minInflation + (
    stakedFraction <= idealStake
      ? (stakedFraction * (idealInterestNumber - (minInflation / idealStake)))
      : (((idealInterestNumber * idealStake) - minInflation) * Math.pow(2, (idealStake - stakedFraction) / falloff))
  ));

  const multiplierImpact = totalTeamMultipliers.isZero() ? 1.0 : totalStaked.mul(BN_MILLION).div(totalStaked.add(totalTeamMultipliers)).toNumber() / 1e6;

  return {
    inflation,
    stakedReturn: stakedFraction
      ? (inflation * multiplierImpact / stakedFraction)
      : 0
  };
}

const DEFAULTS: Inflation = { idealInterest: 0, idealStake: 0, inflation: 0, stakedFraction: 0, stakedReturn: 0 };

export function useInflationImpl (totalStaked?: BN, totalTeamMultipliers?: BN) {
  const { api } = useApi();
  const inflationParams = useInflationParams(api);
  const totalStakeableIssuance = useTotalStakeableIssuance();
  const idealInterest = useIdealInterest();

  const inflation = useMemo(() => {
    return totalStaked && totalStakeableIssuance && idealInterest && inflationParams && totalTeamMultipliers &&
      calcInflation(inflationParams, totalStaked, totalStakeableIssuance, idealInterest, totalTeamMultipliers);
  }, [inflationParams, totalStakeableIssuance, idealInterest, totalStaked, totalTeamMultipliers]);

  return { ...DEFAULTS, ...inflation };
}

export const useInflation = createNamedHook('useInflation', useInflationImpl);
