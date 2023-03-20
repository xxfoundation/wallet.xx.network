// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Inflation } from '@polkadot/react-hooks/types';
import type { Compact } from '@polkadot/types';
import type { AccountId, Balance, BlockNumber, EraIndex, Exposure, Hash, SessionIndex, ValidatorPrefs, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import type { Perbill } from '@polkadot/types/interfaces/runtime';
import type { BN } from '@polkadot/util';

export type Nominators = Record<string, string[]>;

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';

export type ValidatorFilter = 'all' | 'hasNominators' | 'noNominators' | 'hasWarnings' | 'noWarnings' | 'iNominated' | 'nextSet';

export interface NominatedBy {
  index: number;
  nominatorId: string;
  submittedIn: EraIndex;
}

export type NominatedByMap = Record<string, NominatedBy[]>;

export interface Slash {
  accountId: AccountId;
  amount: Balance;
}

export interface SessionRewards {
  blockHash: Hash;
  blockNumber: BlockNumber;
  isEventsEmpty: boolean;
  parentHash: Hash;
  reward: Balance;
  sessionIndex: SessionIndex;
  slashes: Slash[];
  treasury: Balance;
}

interface ValidatorInfoRank {
  rankBondOther: number;
  rankComm: number;
  rankBondOwn: number;
  rankBondTotal: number;
  rankPredictedStake: number;
  rankNumNominators: number;
  rankOverall: number;
  rankReward: number;
  rankTeamMultiplier: number;
}

export interface ExposureWithCustody extends Exposure {
  custody?: Compact<Balance>;
}

export interface ValidatorInfo extends ValidatorInfoRank {
  accountId: AccountId;
  bondOther: BN;
  bondOwn: BN;
  bondShare: number;
  bondTotal: BN;
  bondTotalWithTM: BN;
  electedStake: BN;
  predictedStake: BN;
  predictedElected?: boolean;
  cmixId?: string;
  commission?: Compact<Perbill>;
  commissionPer: number;
  pastAvgCommission: number;
  isCommissionReducing: boolean;
  exposure: ExposureWithCustody;
  isActive: boolean;
  isBlocking: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isNominating: boolean;
  nominatingAccounts: string[];
  key: string;
  knownLength: BN;
  lastPayout?: BN;
  minNominated: BN;
  numNominators: number;
  numRecentPayouts: number;
  skipRewards: boolean;
  stakedReturn: number;
  stakedReturnCmp: number;
  validatorPrefs?: ValidatorPrefs | ValidatorPrefsTo196;
  withReturns?: boolean;
  teamMultiplier: BN;
}

export type TargetSortBy = keyof ValidatorInfoRank;

export interface SortedTargets {
  avgStakedWithTM?: BN;
  counterForNominators?: BN;
  counterForValidators?: BN;
  custodyRewardsActive: boolean;
  electedAvgStaked?: BN;
  electedLowStaked?: BN;
  electedIds?: string[];
  historyDepth?: BN;
  inflation: Inflation;
  lastEra?: BN;
  lowStaked?: BN;
  medianComm: number;
  maxNominatorsCount?: BN;
  maxValidatorsCount?: BN;
  minNominated: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  nominators?: string[];
  nominateIds?: string[];
  totalStaked?: BN;
  totalIssuance?: BN;
  validators?: ValidatorInfo[];
  validatorIds?: string[];
  waitingIds?: string[];
}

export interface PoolAccounts {
  rewardId: string;
  stashId: string;
}
