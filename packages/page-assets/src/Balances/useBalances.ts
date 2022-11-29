// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAssetsAssetBalance } from '@polkadot/types/lookup';
import type { Option } from '@polkadot/types-codec';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useApi, useCall } from '@polkadot/react-hooks';

interface AccountResult {
  accountId: string;
  account: PalletAssetsAssetBalance;
}

interface Result {
  assetId: BN;
  accounts: AccountResult[];
}

function isOptional (value: PalletAssetsAssetBalance | Option<PalletAssetsAssetBalance>): value is Option<PalletAssetsAssetBalance> {
  return (value as Option<PalletAssetsAssetBalance>).isSome || (value as Option<PalletAssetsAssetBalance>).isNone;
}

const OPTS = {
  transform: ([[params], accounts]: [[[BN, string][]], (PalletAssetsAssetBalance | Option<PalletAssetsAssetBalance>)[]]): Result => ({
    accounts: params
      .map(([, accountId], index) => {
        const o = accounts[index];

        return {
          account: isOptional(o)
            ? o.unwrapOr(null)
            : o,
          accountId
        };
      })
      .filter((a): a is AccountResult =>
        !!a.account &&
        !a.account.balance.isZero()
      ),
    assetId: params[0][0]
  }),
  withParamsTransform: true
};

function useBalancesImpl (id?: BN | null): AccountResult[] | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const keys = useMemo(
    () => [allAccounts.map((a) => [id, a])],
    [allAccounts, id]
  );
  const query = useCall(keys && api.query.assets.account.multi, keys, OPTS);

  return (query && id && (query.assetId === id) && query.accounts) || null;
}

export default createNamedHook('useBalances', useBalancesImpl);
