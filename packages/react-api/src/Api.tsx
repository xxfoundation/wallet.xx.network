// Copyright 2017-2022 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@xxnetwork/custom-types/interfaces/augment';
import '@xxnetwork/custom-derives/types/augment';

import type { InjectedExtension } from '@polkadot/extension-inject/types';
import type { ActionStatusBase, QueueAction$Add } from '@polkadot/react-components/Status/types';
import type { ProviderStats } from '@polkadot/rpc-provider/types';
import type { ChainProperties, ChainType } from '@polkadot/types/interfaces';
import type { KeyringStore } from '@polkadot/ui-keyring/types';
import type { ApiProps, ApiState } from './types';

import custom from '@xxnetwork/custom-derives';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import store from 'store';

import { ApiPromise, ScProvider, WsProvider } from '@polkadot/api';
import { deriveMapCache, setDeriveCache } from '@polkadot/api-derive/util';
import { ethereumChains, typesBundle } from '@polkadot/apps-config';
import { web3AccountsSubscribe, web3Enable } from '@polkadot/extension-dapp';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import { StatusContext } from '@polkadot/react-components/Status';
import { useApiUrl, useEndpoint } from '@polkadot/react-hooks';
import { useSessionStorage } from '@polkadot/react-hooks/useStorage';
import ApiSigner from '@polkadot/react-signer/signers/ApiSigner';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { formatBalance, isNumber, isTestChain, objectSpread, stringify } from '@polkadot/util';
import { defaults as addressDefaults } from '@polkadot/util-crypto/address/defaults';

import ApiContext from './ApiContext';
import { lightSpecs, relaySpecs } from './light';
import registry from './typeRegistry';
import { decodeUrlTypes } from './urlTypes';
import PreferenceAlert from './PreferenceAlert';
import { InjectionPreference } from './types';

interface Props {
  children: React.ReactNode;
  apiUrl: string;
  isElectron: boolean;
  store?: KeyringStore;
}

interface InjectedAccountExt {
  address: string;
  meta: {
    genesisHash: string;
    name: string;
    source: string;
    whenCreated: number;
  };
}

interface ChainData {
  properties: ChainProperties;
  systemChain: string;
  systemChainType: ChainType;
  systemName: string;
  systemVersion: string;
}

export const DEFAULT_DECIMALS = registry.createType('u32', 12);
export const DEFAULT_SS58 = registry.createType('u32', addressDefaults.prefix);
export const DEFAULT_AUX = ['Aux1', 'Aux2', 'Aux3', 'Aux4', 'Aux5', 'Aux6', 'Aux7', 'Aux8', 'Aux9'];

let api: ApiPromise;

export { api };

function isKeyringLoaded () {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

function getDevTypes (): Record<string, Record<string, string>> {
  const types = decodeUrlTypes() || store.get('types', {}) as Record<string, Record<string, string>>;
  const names = Object.keys(types);

  names.length && console.log('Injected types:', names.join(', '));

  return types;
}

function createLink (baseApiUrl: string, isElectron: boolean): (path: string) => string {
  return (path: string, apiUrl?: string): string =>
    `${isElectron
      ? 'https://wallet.xx.network/'
      : `${window.location.origin}${window.location.pathname}`
    }?rpc=${encodeURIComponent(apiUrl || baseApiUrl)}#${path}`;
}

function getStats (...apis: ApiPromise[]): [ProviderStats, number] {
  const stats = apis.reduce<ProviderStats>((r, api) => {
    if (api) {
      const stats = api.stats;

      if (stats) {
        r.active.requests += stats.active.requests;
        r.active.subscriptions += stats.active.subscriptions;
        r.total.bytesRecv += stats.total.bytesRecv;
        r.total.bytesSent += stats.total.bytesSent;
        r.total.cached += stats.total.cached;
        r.total.errors += stats.total.errors;
        r.total.requests += stats.total.requests;
        r.total.subscriptions += stats.total.subscriptions;
        r.total.timeout += stats.total.timeout;
      }
    }

    return r;
  }, {
    active: {
      requests: 0,
      subscriptions: 0
    },
    total: {
      bytesRecv: 0,
      bytesSent: 0,
      cached: 0,
      errors: 0,
      requests: 0,
      subscriptions: 0,
      timeout: 0
    }
  });

  return [stats, Date.now()];
}

async function retrieve (api: ApiPromise): Promise<ChainData> {
  const [systemChain, systemChainType, systemName, systemVersion] = await Promise.all([
    api.rpc.system.chain(),
    api.rpc.system.chainType
      ? api.rpc.system.chainType()
      : Promise.resolve(registry.createType('ChainType', 'Live')),
    api.rpc.system.name(),
    api.rpc.system.version()
  ]);

  return {
    properties: registry.createType('ChainProperties', {
      ss58Format: api.registry.chainSS58,
      tokenDecimals: api.registry.chainDecimals,
      tokenSymbol: api.registry.chainTokens
    }),
    systemChain: (systemChain || '<unknown>').toString(),
    systemChainType,
    systemName: systemName.toString(),
    systemVersion: systemVersion.toString()
  };
}

async function loadOnReady (api: ApiPromise, store: KeyringStore | undefined, types: Record<string, Record<string, string>>): Promise<ApiState> {
  registry.register(types);

  const { properties, systemChain, systemChainType, systemName, systemVersion } = await retrieve(api);
  const chainSS58 = properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber();
  const ss58Format = settings.prefix === -1
    ? chainSS58
    : settings.prefix;
  const tokenSymbol = properties.tokenSymbol.unwrapOr([formatBalance.getDefaults().unit, ...DEFAULT_AUX]);
  const tokenDecimals = properties.tokenDecimals.unwrapOr([DEFAULT_DECIMALS]);
  const isEthereum = ethereumChains.includes(api.runtimeVersion.specName.toString());
  const isDevelopment = (systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain));

  console.log(`chain: ${systemChain} (${systemChainType.toString()}), ${stringify(properties)}`);

  // explicitly override the ss58Format as specified
  registry.setChainProperties(registry.createType('ChainProperties', { ss58Format, tokenDecimals, tokenSymbol }));

  // first setup the UI helpers
  formatBalance.setDefaults({
    decimals: tokenDecimals.map((b) => b.toNumber()),
    unit: tokenSymbol[0].toString()
  });
  TokenUnit.setAbbr(tokenSymbol[0].toString());

  // finally load the keyring
  isKeyringLoaded() || keyring.loadAll({
    genesisHash: api.genesisHash,
    isDevelopment,
    ss58Format,
    store,
    type: isEthereum ? 'ethereum' : 'ed25519'
  }, []);

  const defaultSection = Object.keys(api.tx)[0];
  const defaultMethod = Object.keys(api.tx[defaultSection])[0];
  const apiDefaultTx = api.tx[defaultSection][defaultMethod];
  const apiDefaultTxSudo = (api.tx.system && api.tx.system.setCode) || apiDefaultTx;

  setDeriveCache(api.genesisHash.toHex(), deriveMapCache);

  return {
    apiDefaultTx,
    apiDefaultTxSudo,
    canInject: false,
    chainSS58,
    hasInjectedAccounts: false,
    isApiReady: true,
    isDevelopment: isEthereum ? false : isDevelopment,
    isEthereum,
    specName: api.runtimeVersion.specName.toString(),
    specVersion: api.runtimeVersion.specVersion.toString(),
    systemChain,
    systemName,
    systemVersion
  };
}

function notifyOfInjectionChanges (injectedAccounts: InjectedAccountExt[], filteredAccounts: InjectedAccountExt[], queueAction: QueueAction$Add) {
  const notification = (message: string, result: ActionStatusBase['status']): void => {
    queueAction && queueAction({
      action: 'extension',
      message,
      status: result
    });
  };

  // Get arrays of addresses
  const keyringAddresses = keyring.getAccounts()
    .filter(({ meta }) => meta.isInjected)
    .map(({ address, meta }) => {
      return { address, name: meta.name };
    });

  const filteredAddresses = filteredAccounts.map(({ address, meta }) => {
    return { address, name: meta.name };
  });

  const injectedAddresses = injectedAccounts.map(({ address, meta }) => {
    return { address, name: meta.name };
  });

  // Get addresses of accounts being removed
  const removingAddresses = keyringAddresses.filter((x) => !filteredAddresses.some(({ address }) => address === x.address));
  // Get addresses of accounts being added
  const addingAddresses = filteredAddresses.filter((x) => !keyringAddresses.some(({ address }) => address === x.address));
  // Get addresses of accounts on different networks
  const wrongNetworkAddresses = injectedAddresses.filter((x) => !filteredAddresses.some(({ address }) => address === x.address));

  // Remove accounts that are in keyring but not in new filtered accounts
  removingAddresses.forEach(({ address }) => keyring.forgetAccount(address));

  // Notify user of accounts being removed
  if (removingAddresses.length) {
    notification(`Removed ${removingAddresses.length} account${removingAddresses.length > 1 ? 's' : ''}: ${removingAddresses.map(({ name }) => name).join(', ')}`, 'success');
  }

  // Notify user of accounts being added
  if (addingAddresses.length) {
    notification(`Injected ${addingAddresses.length} account${addingAddresses.length > 1 ? 's' : ''}: ${addingAddresses.map(({ name }) => name).join(', ')}`, 'success');
  }

  // Notify user of accounts in extension that are on different network
  if (wrongNetworkAddresses.length) {
    notification(`${wrongNetworkAddresses.length} account${wrongNetworkAddresses.length > 1 ? 's' : ''}: ${wrongNetworkAddresses.map(({ name }) => name).join(', ')} can't be injected due to being on a different network. Change the network in the extension if you wish to inject any of these accounts`, 'eventWarn');
  }

  // Notify user if nothing was done
  if (removingAddresses.length === 0 && addingAddresses.length === 0 && wrongNetworkAddresses.length === 0) {
    notification('No accounts to be injected', 'eventWarn');
  }
}

async function loadAccounts (injectedAccounts: InjectedAccountExt[], store: KeyringStore | undefined, injectionPreference: InjectionPreference, queueAction: QueueAction$Add): Promise<[boolean, boolean]> {
  const { properties, systemChain, systemChainType } = await retrieve(api);
  const ss58Format = settings.prefix === -1
    ? properties.ss58Format.unwrapOr(DEFAULT_SS58).toNumber()
    : settings.prefix;
  const isEthereum = ethereumChains.includes(api.runtimeVersion.specName.toString());
  const isDevelopment = (systemChainType.isDevelopment || systemChainType.isLocal || isTestChain(systemChain));
  const genesisHash = api.genesisHash;

  const canInject = injectedAccounts.length > 0;
  const hasInjectedAccounts = injectionPreference === InjectionPreference.Inject && canInject;
  const filteredAccounts = injectedAccounts.filter(({ meta }) => meta.genesisHash === null || meta.genesisHash === genesisHash.toString());

  if (hasInjectedAccounts) {
    notifyOfInjectionChanges(injectedAccounts, filteredAccounts, queueAction);
  }

  // finally load the keyring
  try {
    keyring.loadAll({
      genesisHash,
      isDevelopment,
      ss58Format,
      store,
      type: isEthereum ? 'ethereum' : 'ed25519'
    }, hasInjectedAccounts ? filteredAccounts : []);
  } catch (err) {
    // Ignoring the error here because keyring.loadInjected is private and this is
    // the only method we can call to load
  }

  return [canInject, hasInjectedAccounts];
}

/**
 * @internal
 * Creates a ScProvider from a <relay>[/parachain] string
 */
async function getLightProvider (chain: string): Promise<ScProvider> {
  const [sc, relayName, paraName] = chain.split('/');

  if (sc !== 'substrate-connect') {
    throw new Error(`Cannot connect to non substrate-connect protocol ${chain}`);
  } else if (!relaySpecs[relayName] || (paraName && (!lightSpecs[relayName] || !lightSpecs[relayName][paraName]))) {
    throw new Error(`Unable to construct light chain ${chain}`);
  }

  const relay = new ScProvider(relaySpecs[relayName]);

  if (!paraName) {
    return relay;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const specMod = await import(`${lightSpecs[relayName][paraName]}`);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return new ScProvider(JSON.stringify(specMod.default), relay);
}

/**
 * @internal
 */
async function createApi (apiUrl: string, signer: ApiSigner, onError: (error: unknown) => void): Promise<Record<string, Record<string, string>>> {
  const types = getDevTypes();
  const isLight = apiUrl.startsWith('light://');

  try {
    const provider = isLight
      ? await getLightProvider(apiUrl.replace('light://', ''))
      : new WsProvider(apiUrl);

    api = new ApiPromise({
      derives: custom,
      provider,
      registry,
      signer,
      types,
      typesBundle
    });

    // See https://github.com/polkadot-js/api/pull/4672#issuecomment-1078843960
    if (isLight) {
      await provider.connect();
    }
  } catch (error) {
    onError(error);
  }

  return types;
}

function Api ({ apiUrl, children, isElectron, store }: Props): React.ReactElement<Props> | null {
  const { queueAction, queuePayload, queueSetTxStatus } = useContext(StatusContext);
  const [state, setState] = useState<ApiState>({ hasInjectedAccounts: false, isApiReady: false } as unknown as ApiState);
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [injectionPreference, setInjectionPreference] = useSessionStorage<InjectionPreference>('injection-preference', InjectionPreference.NotSet);
  const [subscribed, setSubscribed] = useState(false);
  const [injectedAccounts, setInjectedAccounts] = useState<InjectedAccountExt[]>([]);
  const [apiError, setApiError] = useState<null | string>(null);
  const [extensions, setExtensions] = useState<InjectedExtension[] | undefined>();
  const apiEndpoint = useEndpoint(apiUrl);
  const relayUrls = useMemo(
    () => (apiEndpoint && apiEndpoint.valueRelay && isNumber(apiEndpoint.paraId) && (apiEndpoint.paraId < 2000))
      ? apiEndpoint.valueRelay
      : null,
    [apiEndpoint]
  );
  const apiRelay = useApiUrl(relayUrls);
  const value = useMemo<ApiProps>(
    () => objectSpread({}, state, {
      api,
      apiEndpoint,
      apiError,
      apiRelay,
      apiUrl,
      createLink: createLink(apiUrl, isElectron),
      extensions,
      getStats,
      isApiConnected,
      isApiInitialized,
      isElectron,
      isWaitingInjected: !extensions,
      loadInjectionPreference: (override: InjectionPreference) => {
        loadAccounts(injectedAccounts, store, override, queueAction)
          .then(([canInject, hasInjectedAccounts]) => {
            setState({
              ...state,
              canInject,
              hasInjectedAccounts
            });
          })
          .catch((error): void => setApiError((error as Error).message));
      },
      setInjectionPreference
    }),
    [
      state,
      apiEndpoint,
      apiError,
      apiRelay,
      apiUrl,
      extensions,
      isApiConnected,
      isApiInitialized,
      isElectron,
      setInjectionPreference,
      injectedAccounts,
      store,
      queueAction
    ]
  );

  async function subscribe (): Promise<void> {
    await web3AccountsSubscribe((accounts) => {
      setInjectedAccounts(accounts.map(({ address, meta }, whenCreated): InjectedAccountExt => ({
        address,
        meta: objectSpread({}, meta, {
          name: `${meta.name || 'unknown'} (${meta.source})`,
          whenCreated
        })
      })));
    }, { ss58Format: api.registry.chainSS58 });
  }

  const onError = useCallback(
    (error: unknown): void => {
      console.error(error);

      setApiError((error as Error).message);
    },
    [setApiError]
  );

  useEffect(() => {
    if (!subscribed && state.isApiReady && extensions !== undefined) {
      subscribe().catch((err) => {
        console.error(err);
      });
      setSubscribed(true);
    }
  }, [subscribed, state, extensions]);

  useEffect(() => {
    if (subscribed) {
      loadAccounts(injectedAccounts, store, injectionPreference, queueAction)
        .then(([canInject, hasInjectedAccounts]) => {
          setState({
            ...state,
            canInject,
            hasInjectedAccounts
          });
        })
        .catch((error): void => setApiError((error as Error).message));
    }
  }, [store, subscribed, injectionPreference, injectedAccounts, queueAction]);

  // initial initialization
  useEffect((): void => {
    createApi(apiUrl, new ApiSigner(registry, queuePayload, queueSetTxStatus), onError)
      .then((types): void => {
        api.on('connected', () => setIsApiConnected(true));
        api.on('disconnected', () => setIsApiConnected(false));
        api.on('error', onError);
        api.on('ready', (): void => {
          web3Enable('xx network web wallet')
          .then(setExtensions)
          .catch(console.error);

          loadOnReady(api, store, types)
            .then(setState)
            .catch(onError);
        });

        setIsApiInitialized(true);
      })
      .catch(onError);
  }, [apiEndpoint, apiUrl, onError, queuePayload, queueSetTxStatus, store]);

  const showPreferenceAlert = (extensions?.length ?? 0) > 0 && injectionPreference === InjectionPreference.NotSet;

  if (!value.isApiInitialized) {
    return null;
  }

  return (
    <ApiContext.Provider value={value}>
      {showPreferenceAlert && <PreferenceAlert />}
      {children}
    </ApiContext.Provider>
  );
}

export default React.memo(Api);
