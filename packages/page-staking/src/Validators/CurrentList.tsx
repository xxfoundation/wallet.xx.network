// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets, ValidatorInfo } from '../types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { Icon, PaginationAdvanced, Table } from '@polkadot/react-components';
import { useApi, useBlockAuthors, useLoadingDelay, usePagination, useSavedFlags } from '@polkadot/react-hooks';

import Filtering from '../Filtering.js';
import Legend from '../Legend.js';
import { useTranslation } from '../translate.js';
import Address from './Address/index.js';

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

const EMPTY_AUTHORS: Record<string, string> = {};

enum Sorts {
  POINTS,
  COMMISSION
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
  favorites?: string[],
  infoMap?: Record<string, ValidatorInfo>
): AccountExtend[] {
  const sorted = accounts?.slice(0) ?? [];

  if (sort === Sorts.POINTS) {
    sorted.sort(makeSorter(([accountId]) => points?.[accountId] ?? 0));
  } else if (sort === Sorts.COMMISSION) {
    sorted.sort(makeSorter(([accountId]) => infoMap?.[accountId]?.commissionPer ?? 0));
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
  const blockAuthors = useBlockAuthors();
  const { byAuthor, eraPoints } = isIntentions ? { byAuthor: EMPTY_AUTHORS, eraPoints: EMPTY_AUTHORS } : blockAuthors;
  const [nameFilter, setNameFilter] = useState<string>('');
  const [toggles, setToggle] = useSavedFlags('staking:overview', { withIdentity: false });

  const [{ sortBy, sortFromMax }, setSortState] = useState<SortState>({
    sortBy: Sorts.POINTS,
    sortFromMax: true
  });

  const sort = useCallback((key: Sorts) => () => {
    setSortState((state) => ({
      sortBy: key,
      sortFromMax: state.sortBy === key ? !state.sortFromMax : state.sortFromMax
    }));
  }, []);

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
    () => sortAccounts({ sortBy, sortFromMax }, accounts, convertEraPoints(eraPoints), favorites, infoMap),
    [accounts, eraPoints, favorites, infoMap, sortBy, sortFromMax]
  );

  const paginated = usePagination(sorted, { perPage: 50 });
  const finalList = nameFilter ? sorted : paginated.items;

  type HeaderDef = [React.ReactNode?, string?, number?, (() => void)?];

  const headers = useMemo(
    (): HeaderDef[] => isIntentions
      ? [
        [t('intentions'), 'start', 2],
        [t('cmix ID'), 'expand'],
        [t('location')],
        [t('nominators'), 'expand'],
        [
          <>
            {t('commission')} <Icon
              icon={sortBy === Sorts.COMMISSION
                ? (sortFromMax ? 'chevron-down' : 'chevron-up')
                : 'minus'
              }
            />
          </>,
          `${sorted ? `isClickable ${sortBy === Sorts.COMMISSION ? 'highlight--border' : ''} number` : 'number'}`,
          1,
          sort(Sorts.COMMISSION)
        ],
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
        [
          <>
            {t('commission')} <Icon
              icon={sortBy === Sorts.COMMISSION
                ? (sortFromMax ? 'chevron-down' : 'chevron-up')
                : 'minus'
              }
            />
          </>,
          `${sorted ? `isClickable ${sortBy === Sorts.COMMISSION ? 'highlight--border' : ''} number` : 'number'}`,
          1,
          sort(Sorts.COMMISSION)
        ],
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
              ? waiting && nominatedBy && t('No waiting validators found')
              : recentlyOnline && validators && infoMap && t('No active validators found')
          )
        }
        emptySpinner={
          <>
            {!waiting && <div>{t('Retrieving validators')}</div>}
            {!infoMap && <div>{t('Retrieving validator info')}</div>}
            {isIntentions
              ? !nominatedBy && <div>{t('Retrieving nominators')}</div>
              : !recentlyOnline && <div>{t('Retrieving online status')}</div>
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
