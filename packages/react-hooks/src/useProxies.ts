// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId } from '@polkadot/types/interfaces';
import { PalletProxyProxyDefinition, XxnetworkRuntimeProxyType } from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useAccounts } from './useAccounts';
import { useApi } from './useApi';
import { useCall } from './useCall';

function useProxiesImpl (): [PalletProxyProxyDefinition[], BN][] | undefined {
  const { api } = useApi();
  const { allAccounts } = useAccounts();

  return useCall<[PalletProxyProxyDefinition[], BN][]>(api.query.proxy?.proxies.multi, [allAccounts], {
    transform: (result: [([AccountId, XxnetworkRuntimeProxyType] | PalletProxyProxyDefinition)[], BN][]): [PalletProxyProxyDefinition[], BN][] =>
      api.tx.proxy.addProxy.meta.args.length === 3
        ? result as [PalletProxyProxyDefinition[], BN][]
        : (result as [[AccountId, XxnetworkRuntimeProxyType][], BN][]).map(([arr, bn]): [PalletProxyProxyDefinition[], BN] =>
          [arr.map(([delegate, proxyType]): PalletProxyProxyDefinition =>
            api.createType('XxnetworkRuntimeProxyType', {
              delegate,
              proxyType
            })), bn]
        )
  });
}

export const useProxies = createNamedHook('useProxies', useProxiesImpl);
