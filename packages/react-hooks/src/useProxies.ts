// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { AccountId } from '@polkadot/types/interfaces';
import type { PalletProxyProxyDefinition, XxnetworkRuntimeProxyType } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useCall } from './useCall';

const OPTS = {
  transform: (result: [([AccountId, XxnetworkRuntimeProxyType] | PalletProxyProxyDefinition)[], BN][], api: ApiPromise): [PalletProxyProxyDefinition[], BN][] =>
    api.tx.proxy.addProxy.meta.args.length === 3
      ? result as [PalletProxyProxyDefinition[], BN][]
      : (result as [[AccountId, XxnetworkRuntimeProxyType][], BN][]).map(([arr, bn]): [PalletProxyProxyDefinition[], BN] =>
        [arr.map(([delegate, proxyType]): PalletProxyProxyDefinition =>
          api.createType('PalletProxyProxyDefinition', {
            delegate,
            proxyType
          })), bn]
      )
};

function useProxiesImpl (): [PalletProxyProxyDefinition[], BN][] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  return useCall<[PalletProxyProxyDefinition[], BN][]>(api.query.proxy?.proxies.multi, [allAccounts], OPTS);
}

export const useProxies = createNamedHook('useProxies', useProxiesImpl);
