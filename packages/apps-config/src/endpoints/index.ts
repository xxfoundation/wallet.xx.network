// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction, TOptions } from '../types.js';
import type { LinkOption } from './types.js';

import { createCustom, createDev, createOwn } from './development.js';
import { prodChains, prodRelayKusama, prodRelayPolkadot } from './production.js';
import { testChains, testRelayWestend } from './testing.js';
import { testRelayPaseo } from './testingRelayPaseo.js';
import { expandEndpoints } from './util.js';

export { CUSTOM_ENDPOINT_KEY } from './development.js';
export * from './production.js';
export * from './testing.js';

function defaultT (keyOrText: string, text?: string | TOptions, options?: TOptions): string {
  return (
    (options?.replace?.host as string) ||
    text?.toString() ||
    keyOrText
  );
}

export function createWsEndpoints (t: TFunction = defaultT, firstOnly = false, withSort = true): LinkOption[] {
  // Find xx network endpoint from production chains
  const xxNetwork = prodChains.find((chain) => chain.info === 'xxnetwork');
  
  // Collect endpoints for custom endpoint UI lookup
  const allEndpoints = xxNetwork ? [xxNetwork] : [];

  return [
    ...createCustom(t, allEndpoints),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.xxnetwork', 'xx network', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...(xxNetwork ? expandEndpoints(t, [xxNetwork], firstOnly, withSort) : []),
    {
      isDevelopment: true,
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...createDev(t),
    ...createOwn(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
