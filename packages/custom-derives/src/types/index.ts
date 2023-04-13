/* eslint-disable header/header */
import type { AccountId, Balance } from '@polkadot/types/interfaces';

export interface CustodyAccount {
  accountId?: string,
  targets: AccountId[];
  active?: Balance;
}

export type DeriveCustodyAccounts = CustodyAccount[];
