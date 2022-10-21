// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { Authors } from '@polkadot/react-query/BlockAuthors';
import type { AccountId } from '@polkadot/types/interfaces';
import type { SortedTargets, ValidatorInfo } from '../types';

import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Icon, PaginationAdvanced, Table } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay, usePagination, useSavedFlags } from '@polkadot/react-hooks';
import { BlockAuthorsContext } from '@polkadot/react-query';

import Filtering from '../Filtering';
import Legend from '../Legend';
import { useTranslation } from '../translate';
import useNominations from '../useNominations';
import Address from './Address';
import { XxCmixCmixVariables } from '@polkadot/types/lookup';

interface Props {
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  paraValidators?: Record<string, boolean>;
  setNominators?: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

type AccountExtend = [string, boolean, boolean];

interface Filtered {
  validators?: AccountExtend[];
  waiting?: AccountExtend[];
}

const EmptyAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor: {}, eraPoints: {}, lastBlockAuthors: [], lastHeaders: [] });

enum Sorts {
  POINTS
}

type SortState = {
  sortBy?: Sorts;
  sortFromMax: boolean;
}

function makeSorter (transformer: (e: AccountExtend) => number): (a: AccountExtend, b: AccountExtend) => number {
  return function (a: AccountExtend, b: AccountExtend) {
    const x = transformer(a);
    const y = transformer(b);

    if (x > y) { return 1; }

    if (x < y) { return -1; }

    return 0;
  };
}

function convertEraPoints (points: Record<string, string>): Record<string, number> {
  return Object.entries(points).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: parseInt(value?.replace(',', ''), 10)
  }), {} as Record<string, number>);
}

function sortAccounts (
  { sortBy: sort, sortFromMax = true }: SortState,
  accounts?: AccountExtend[],
  points?: Record<string, number>,
  favorites?: string[]
): AccountExtend[] {
  const sorted = accounts?.slice(0) ?? [];

  if (sort === Sorts.POINTS) {
    sorted.sort(makeSorter(([accountId]) => points?.[accountId] ?? 0));
  }

  if (sortFromMax) {
    sorted.reverse();
  }

  sorted.sort(makeSorter(([accountId]) => favorites?.includes(accountId) ? 0 : 1));

  return sorted;
}

function filterAccounts (accounts: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId) => !without.includes(accountId))
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([, , isFavA]: AccountExtend, [, , isFavB]: AccountExtend) =>
      isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1)
    );
}

function accountsToString (accounts: AccountId[]): string[] {
  return accounts.map((a) => a.toString());
}

function getFiltered (stakingOverview: DeriveStakingOverview, favorites: string[], next?: string[]): Filtered {
  const allElected = accountsToString(stakingOverview.nextElected);
  const validatorIds = accountsToString(stakingOverview.validators);

  return {
    validators: filterAccounts(validatorIds, allElected, favorites, []),
    waiting: filterAccounts(allElected, allElected, favorites, validatorIds).concat(
      filterAccounts(next, [], favorites, allElected)
    )
  };
}

const DEFAULT_PARAS = {};

function CurrentList ({ favorites, hasQueries, isIntentions, paraValidators = DEFAULT_PARAS, stakingOverview, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useContext(isIntentions ? EmptyAuthorsContext : BlockAuthorsContext);
  const recentlyOnline = useCall<DeriveHeartbeats>(!isIntentions && api.derive.imOnline?.receivedHeartbeats);
  const nominatedBy = useNominations(isIntentions);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [toggles, setToggle] = useSavedFlags('staking:overview', { withIdentity: false });

  const [{ sortBy, sortFromMax }, setSortState] = useState<SortState>({
    sortBy: Sorts.POINTS,
    sortFromMax: true
  });

  const sort = useCallback((key: Sorts) => () => {
    setSortState((state) => ({
      sortBy,
      sortFromMax: state.sortBy === key ? !state.sortFromMax : state.sortFromMax
    }));
  }, [sortBy]);

  const cmixVariables = useCall<XxCmixCmixVariables>(api.query.xxCmix.cmixVariables);
  const points = cmixVariables?.performance.points;

  const tooltipPoints = useMemo(() => <div>
    {t<string>('Points for authoring a block: {{points}} points', { points: points?.block })}<br />
    {t<string>('Per completed cMix round: {{points}} points', { points: points?.success })}<br />
    {t<string>('Per failed cMix realtime round: -{{points}} points', { points: points?.failure })}
  </div>, [t, points]);

  const tooltipCommission= useMemo(() => <div>
    {t<string>('This is the average commission this validator charged when elected over the past 7 eras.')}<br/>
    {t<string>('Commission numbers are shown in red if the current commission is at least 20% smaller than the previously charged average.')}
  </div>, [t]);

  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay();

  const { validators, waiting } = useMemo(
    () => stakingOverview ? getFiltered(stakingOverview, favorites, targets.waitingIds) : {},
    [favorites, stakingOverview, targets]
  );

  const infoMap = useMemo(
    () => targets.validators?.reduce<Record<string, ValidatorInfo>>((result, info) => {
      result[info.key] = info;

      return result;
    }, {}),
    [targets]
  );

  const accounts = useMemo(() => (
    isIntentions
      ? nominatedBy && waiting
      : validators
  ) || [], [isIntentions, nominatedBy, waiting, validators]);

  const sorted = useMemo(
    () => sortAccounts({ sortBy, sortFromMax }, accounts, convertEraPoints(eraPoints), favorites),
    [accounts, eraPoints, favorites, sortBy, sortFromMax]
  );

  const paginated = usePagination(sorted, { perPage: 50 });
  const finalList = nameFilter ? sorted : paginated.items;

  const headers = useMemo(
    () => isIntentions
      ? [
        [t('intentions'), 'start', 2],
        [t('cmix ID'), 'expand'],
        [t('location')],
        [t('nominators'), 'expand'],
        [t('commission'), 'number'],
        [t('past avg commission'), 'number'],
        [t('stats')],
        [undefined, 'media--1200']
      ]
      : [
        [t('validators'), 'start', 2],
        [t('cmix ID'), 'expand'],
        [t('location')],
        [t('other stake'), 'expand'],
        [t('own stake'), 'media--1100'],
        [t('team multiplier'), 'media--1100'],
        [t('commission')],
        [
          <>
            {t('points')} <Icon
              icon={sortBy === Sorts.POINTS
                ? (sortFromMax ? 'chevron-down' : 'chevron-up')
                : 'minus'
              }
            />
          </>,
          `${sorted ? `isClickable ${sortBy === Sorts.POINTS ? 'highlight--border' : ''} number` : 'number'}`,
          1,
          sort(Sorts.POINTS)
        ],
        [t('last #')],
        [t('stats')],
        [undefined, 'media--1200']
      ],
    [isIntentions, sort, sortBy, sortFromMax, sorted, t]
  );

  return (
    <>
      <Table
        empty={
          !isLoading && (
            isIntentions
              ? waiting && nominatedBy && t<string>('No waiting validators found')
              : recentlyOnline && validators && infoMap && t<string>('No active validators found')
          )
        }
        emptySpinner={
          <>
            {!waiting && <div>{t<string>('Retrieving validators')}</div>}
            {!infoMap && <div>{t<string>('Retrieving validator info')}</div>}
            {isIntentions
              ? !nominatedBy && <div>{t<string>('Retrieving nominators')}</div>
              : !recentlyOnline && <div>{t<string>('Retrieving online status')}</div>
            }
          </>
        }
        filter={
          <Filtering
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
            setWithIdentity={setToggle.withIdentity}
            withIdentity={toggles.withIdentity}
          />
        }
        header={headers}
        help={isIntentions ? [tooltipCommission] : [tooltipPoints]}
        helpHeader={isIntentions ? headers[5] : headers[7]}
        legend={
          <Legend isRelay={!isIntentions && !!(api.query.parasShared || api.query.shared)?.activeValidatorIndices} />
        }
      >
        {!isLoading &&
          finalList?.map(([address, isElected, isFavorite]): React.ReactNode => (
            <Address
              address={address}
              filterName={nameFilter}
              hasQueries={hasQueries}
              isElected={isElected}
              isFavorite={isFavorite}
              isMain={!isIntentions}
              isPara={isIntentions ? false : paraValidators[address]}
              key={address}
              lastBlock={byAuthor[address]}
              nominatedBy={nominatedBy?.[address]}
              points={eraPoints[address]}
              recentlyOnline={recentlyOnline?.[address]}
              toggleFavorite={toggleFavorite}
              validatorInfo={infoMap?.[address]}
              withIdentity={toggles.withIdentity}
            />
          ))
        }
      </Table>
      {!nameFilter && <PaginationAdvanced {...paginated} />}
    </>
  );
}

export default React.memo(CurrentList);
