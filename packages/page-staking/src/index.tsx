// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { AppProps as Props, ThemeProps } from '@polkadot/react-components/types';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useAvailableSlashes, useCall, useFavorites, useOwnStashInfos } from '@polkadot/react-hooks';
import { BN, isFunction } from '@polkadot/util';

import basicMd from './md/basic.md';
import NodeLocationsProvider from './NodeLocationContext/Provider';
import Actions from './Actions';
import { STORE_FAVS_BASE } from './constants';
import Nominators from './Nominators';
import Payouts from './Payouts';
import Query from './Query';
import Slashes from './Slashes';
import Targets from './Targets';
import { useTranslation } from './translate';
import useNominations from './useNominations';
import useSortedTargets from './useSortedTargets';
import Validators from './Validators';

const HIDDEN_ACC = ['actions', 'payout'];

function createPathRef (basePath: string): Record<string, string | string[]> {
  return {
    bags: `${basePath}/bags`,
    nominators: `${basePath}/nominators`,
    payout: `${basePath}/payout`,
    pools: `${basePath}/pools`,
    query: [
      `${basePath}/query/:value`,
      `${basePath}/query`
    ],
    slashes: `${basePath}/slashes`,
    targets: `${basePath}/targets`
  };
}

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { areAccountsLoaded, hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [loadNominations, setLoadNominations] = useState(false);
  const nominatedBy = useNominations(loadNominations);
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const minCommission = useCall<BN>(api.query.staking.minValidatorCommission);
  const ownStashes = useOwnStashInfos();
  const slashes = useAvailableSlashes();
  const targets = useSortedTargets(favorites);
  const pathRef = useRef(createPathRef(basePath));

  const hasQueries = useMemo(
    () => hasAccounts && !!(api.query.imOnline?.authoredBlocks) && !!(api.query.staking.activeEra),
    [api, hasAccounts]
  );

  const hasStashes = useMemo(
    () => hasAccounts && !!ownStashes && (ownStashes.length !== 0),
    [hasAccounts, ownStashes]
  );

  const ownValidators = useMemo(
    () => (ownStashes || []).filter(({ isStashValidating }) => isStashValidating),
    [ownStashes]
  );

  const toggleNominatedBy = useCallback(
    () => setLoadNominations(true),
    []
  );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'actions',
      text: t<string>('Accounts')
    },
    hasStashes && isFunction(api.query.staking.activeEra) && {
      name: 'payout',
      text: t<string>('Payouts')
    },
    isFunction(api.query.nominationPools?.minCreateBond) && {
      name: 'pools',
      text: t<string>('Pools')
    },
    {
      alias: 'returns',
      name: 'targets',
      text: t<string>('Targets')
    },
    {
      name: 'nominators',
      text: t<string>('Nominators')
    },
    hasStashes && isFunction((api.query.voterBagsList || api.query.bagsList || api.query.voterList)?.counterForListNodes) && {
      name: 'bags',
      text: t<string>('Bags')
    },
    {
      count: slashes.reduce((count, [, unapplied]) => count + unapplied.length, 0),
      name: 'slashes',
      text: t<string>('Slashes')
    },
    {
      hasParams: true,
      name: 'query',
      text: t<string>('Validator stats')
    }
  ].filter((q): q is { name: string; text: string } => !!q), [api, hasStashes, slashes, t]);

  return (
    <main className={`staking--App ${className}`}>
      <NodeLocationsProvider>
        <HelpOverlay md={basicMd as string} />
        <Tabs
          basePath={basePath}
          hidden={
            areAccountsLoaded && !hasAccounts
              ? HIDDEN_ACC
              : undefined
          }
          items={items}
        />
        <Switch>
          <Route path={pathRef.current.payout}>
            <Payouts
              historyDepth={targets.historyDepth}
              ownValidators={ownValidators}
            />
          </Route>
          <Route path={pathRef.current.query}>
            <Query />
          </Route>
          <Route path={pathRef.current.slashes}>
            <Slashes
              ownStashes={ownStashes}
              slashes={slashes}
            />
          </Route>
          <Route path={pathRef.current.targets}>
            <Targets
              nominatedBy={nominatedBy}
              ownStashes={ownStashes}
              stakingOverview={stakingOverview}
              targets={targets}
              toggleFavorite={toggleFavorite}
              toggleNominatedBy={toggleNominatedBy}
            />
          </Route>
          <Route path={pathRef.current.nominators}>
            <Nominators ownStashes={ownStashes} />
          </Route>
        </Switch>
        <Actions
          className={pathname === `${basePath}/actions` ? '' : '--hidden'}
          minCommission={minCommission}
          ownStashes={ownStashes}
          targets={targets}
        />
        <Validators
          className={basePath === pathname ? '' : '--hidden'}
          favorites={favorites}
          hasAccounts={hasAccounts}
          hasQueries={hasQueries}
          minCommission={minCommission}
          nominatedBy={nominatedBy}
          ownStashes={ownStashes}
          stakingOverview={stakingOverview}
          targets={targets}
          toggleFavorite={toggleFavorite}
          toggleNominatedBy={toggleNominatedBy}
        />
      </NodeLocationsProvider>
    </main>
  );
}

export default React.memo(styled(StakingApp)(({ theme }: ThemeProps) => `
  .staking--Chart {
    margin-top: 1.5rem;

    h1 {
      margin-bottom: 0.5rem;
    }

    .ui--Spinner {
      margin: 2.5rem auto;
    }
  }

  .staking--optionsBar {
    margin: 0.5rem 0 1rem;
    text-align: center;
    white-space: normal;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: var(--color-error);

    ${theme.theme === 'dark'
    ? `font-weight: bold;
      .ui--FormatBalance-value {

        > .ui--FormatBalance-postfix {
          opacity: 1;
        }
      }`
    : ''};
    }
  }
`));
