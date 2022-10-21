// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Modal from '@polkadot/app-accounts/modals/Betanet';
// import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
// import { StorageKey } from '@polkadot/types';


export default function create(t: TFunction): Route {

  // TODO: find a way to add this hidden restriction without bypasing the react hooks problem
  // Check if wallets are in the betanet list
  // const { api } = useApi();
  // const data = useCall<StorageKey<any>[]>(api.query.xxBetanetRewards.accounts.keys)
  // let accounts = [] as string[];
  // data && data.map(({ args: [accountId] }) => {
  //   accounts.push(JSON.stringify(accountId).replace(/\"/g, ''))
  // });

  // Define isHidden variable accordingly
  // let isHidden = false
  // const { allAccounts, hasAccounts } = useAccounts();
  // if (hasAccounts && accounts) {
  //   allAccounts.map(account => {
  //     isHidden = accounts.indexOf(account) != -1;
  //   })
  // }

  return {
    Component: Modal,
    Modal,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'query.xxBetanetRewards.accounts'
      ]
    },
    group: 'accounts',
    icon: 'calculator',
    name: 'betanet',
    text: t('nav.betanet', 'Betanet Rewards', { ns: 'apps-routing' })
  };
}
