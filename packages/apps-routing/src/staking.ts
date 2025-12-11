// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-staking';

function needsApiCheck (api: ApiPromise): boolean {
  // Hide for Asset Hub chains and Relay chains with stakingAhClient
  if (api.query.stakingAhClient || api.tx.stakingRcClient) {
    return false;
  }

  // Check if staking pallet exists with erasStakers or erasStakersOverview
  const hasErasStakers = typeof api.query.staking?.erasStakers === 'function';
  const hasErasStakersOverview = typeof api.query.staking?.erasStakersOverview === 'function';

  if (!hasErasStakers && !hasErasStakersOverview) {
    console.warn('No erasStakers or erasStakersOverview found, disabling staking route');

    return false;
  }

  // Verify staking.bond transaction exists
  if (typeof api.tx.staking?.bond !== 'function') {
    console.warn('No staking.bond transaction found, disabling staking route');

    return false;
  }

  return true;
}

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.staking.bond'
      ],
      needsApiCheck
    },
    group: 'network',
    icon: 'certificate',
    name: 'staking',
    text: t('nav.staking', 'Staking', { ns: 'apps-routing' })
  };
}
