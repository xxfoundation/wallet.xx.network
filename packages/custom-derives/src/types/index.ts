// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { AccountId, Balance } from '@polkadot/types/interfaces';

export interface CustodyAccount {
  accountId?: string,
  targets: AccountId[];
  active?: Balance;
}

export type DeriveCustodyAccounts = CustodyAccount[];
