// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { Nominations } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

export type NominatorStake = {
  nominator?: string;
  nominee?: string;
  value?: BN;
}

export type Nominator = {
  accountId: string;
  stakes?: NominatorStake[];
  totalStake?: BN;
  balance?: BN;
  nominations?: Nominations
}
