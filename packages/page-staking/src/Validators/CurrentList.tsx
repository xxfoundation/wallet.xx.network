// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { Authors } from '@polkadot/react-query/BlockAuthors';
import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets, ValidatorInfo } from '../types';

import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Icon, PaginationAdvanced, Table } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay, usePagination, useSavedFlags } from '@polkadot/react-hooks';
import { BlockAuthorsContext } from '@polkadot/react-query';
import { XxCmixCmixVariables } from '@polkadot/types/lookup';

import Filtering from '../Filtering';
import Legend from '../Legend';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  className?: string;
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  isIntentionsTrigger?: boolean;
  isOwn: boolean;
  minCommission?: BN;
  nominatedBy?: NominatedByMap;
  ownStashIds?: string[];
  paraValidators?: Record<string, boolean>;
  recentlyOnline?: DeriveHeartbeats;
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

    if (x > y) {
      return 1;
    }

    if (x < y) {
      return -1;
    }

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

function filterAccounts (isOwn: boolean, accounts: string[] = [], ownStashIds: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId) =>
      !without.includes(accountId) && (
        !isOwn ||
        ownStashIds.includes(accountId)
      )
    )
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([accA,, isFavA]: AccountExtend, [accB,, isFavB]: AccountExtend): number => {
      const isStashA = ownStashIds.includes(accA);
      const isStashB = ownStashIds.includes(accB);

      return isFavA === isFavB
        ? isStashA === isStashB
          ? 0
          : (isStashA ? -1 : 1)
        : (isFavA ? -1 : 1);
    });
}

function accountsToString (accounts: AccountId[]): string[] {
  const result = new Array<string>(accounts.length);

  for (let i = 0; i < accounts.length; i++) {
    result[i] = accounts[i].toString();
  }

  return result;
}

function getFiltered (isOwn: boolean, stakingOverview: DeriveStakingOverview | undefined, favorites: string[], next?: string[], ownStashIds?: string[]): Filtered {
  if (!stakingOverview) {
    return {};
  }

  const allElected = accountsToString(stakingOverview.nextElected);
  const validatorIds = accountsToString(stakingOverview.validators);

  return {
    validators: filterAccounts(isOwn, validatorIds, ownStashIds, allElected, favorites, []),
    waiting: filterAccounts(isOwn, allElected, ownStashIds, allElected, favorites, validatorIds).concat(
      filterAccounts(isOwn, next, ownStashIds, [], favorites, allElected)
    )
  };
}

function mapValidators (infos: ValidatorInfo[]): Record<string, ValidatorInfo> {
  const result: Record<string, ValidatorInfo> = {};

  for (let i = 0; i < infos.length; i++) {
    const info = infos[i];

    result[info.key] = info;
  }

  return result;
}

const DEFAULT_PARAS = {};

function CurrentList ({ favorites, hasQueries, isIntentions, isOwn, nominatedBy, ownStashIds, paraValidators = DEFAULT_PARAS, recentlyOnline, stakingOverview, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useContext(isIntentions ? EmptyAuthorsContext : BlockAuthorsContext);
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

  const tooltipCommission = useMemo(() => <div>
    {t<string>('This is the average commission this validator charged when elected over the past 7 eras.')}<br/>
    {t<string>('Commission numbers are shown in red if the current commission is at least 20% smaller than the previously charged average.')}
  </div>, [t]);

  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay();

  const { validators, waiting } = useMemo(
    () => getFiltered(isOwn, stakingOverview, favorites, targets.waitingIds, ownStashIds),
    [favorites, isOwn, ownStashIds, stakingOverview, targets]
  );

  const accounts = useMemo(
    () => isLoading
      ? undefined
      : isIntentions
        ? nominatedBy && waiting
        : validators,
    [isIntentions, isLoading, nominatedBy, validators, waiting]
  );

  const infoMap = useMemo(
    () => targets.validators && mapValidators(targets.validators),
    [targets]
  );

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
