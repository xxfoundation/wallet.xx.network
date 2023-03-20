// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAccount, DeriveStakingElected, DeriveStakingQuery, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { Option, StorageKey } from '@polkadot/types';
import type { Nominations } from '@polkadot/types/interfaces';
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';
import type { Nominator, NominatorStake } from './types';

import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Icon, PaginationAdvanced, Table, Toggle } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay, usePagination, useSavedFlags } from '@polkadot/react-hooks';
import { arrayFlatten, BN, BN_ZERO } from '@polkadot/util';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import useIdentities from '../useIdentities';
import NominatorRow from './Nominator';

const DEFAULT_NAME = { isQueryFiltered: false, nameFilter: '' };

type Props = {
  ownStashes?: StakerState[];
}

function nominationStakeMapper ({ accountId, exposure }: DeriveStakingQuery) {
  return exposure.others.map(
    ({ value, who }): NominatorStake => ({
      nominator: who.toString(),
      nominee: accountId.toString(),
      value: value.unwrap()
    })
  );
}

function extractNominatorStakes (queries: DeriveStakingQuery[]) {
  return arrayFlatten(queries.map(nominationStakeMapper));
}

function useNominatorStakes () {
  const { api } = useApi();
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo, [{ withExposure: true }]);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo, [{ withExposure: true }]);

  const nominators = useMemo(
    () => (electedInfo || waitingInfo) && [
      ...(electedInfo ? extractNominatorStakes(electedInfo.info) : []),
      ...(waitingInfo ? extractNominatorStakes(waitingInfo.info) : [])
    ],
    [electedInfo, waitingInfo]
  );

  return nominators;
}

function extractNominations (nominations: [StorageKey, Option<Nominations>][]): [string, Nominations][] {
  return nominations
    .filter(([key, optNoms]) => optNoms.isSome && key.args.length)
    .map(([key, optNoms]) => {
      const nominatorId = key.args[0].toString();

      return [
        nominatorId,
        optNoms.unwrap()
      ];
    });
}

function useNominations () {
  const { api } = useApi();
  const nominators = useCall<[StorageKey, Option<Nominations>][]>(api.query.staking.nominators.entries);

  return useMemo(
    () => nominators && extractNominations(nominators),
    [nominators]
  );
}

type Identities = ReturnType<typeof useIdentities>;

function filterByIdentity (identities: Identities, withIdentity: boolean) {
  return ({ accountId }: Nominator) => {
    const identity = identities?.[accountId];

    return (!withIdentity || !!identity?.hasIdentity);
  };
}

function applyFilters (withIdentity: boolean, withAccountNominations: boolean, identities: Identities, nominators?: Nominator[], teamMultipliersAddresses?: string[], stashIds?: string[]) {
  return nominators?.filter(filterByIdentity(identities, withIdentity))
    .filter(({ accountId }) => !teamMultipliersAddresses || !teamMultipliersAddresses.includes(accountId))
    .filter(({ accountId }) => !withAccountNominations || stashIds?.includes(accountId));
}

enum Sorts {
  RANK_BALANCE,
  RANK_OWN_STAKE,
  RANK_NOMINATION_TARGETS,
  RANK_LAST_UPDATES
}

const sortKeys = Object.values(Sorts).filter((k) => typeof k === 'number') as Sorts[];

type SortState = {
  sortBy: Sorts;
  sortFromMax: boolean;
}

function makeSorter (transformer: (n: Nominator) => number): (a: Nominator, b: Nominator) => number {
  return function (a: Nominator, b: Nominator) {
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

function sortNominators (
  { sortBy: sort = Sorts.RANK_BALANCE, sortFromMax = true }: SortState,
  nominators?: Nominator[]
): Nominator[] {
  const sorted = nominators?.slice(0) ?? [];

  if (sort === Sorts.RANK_BALANCE && nominators) {
    sorted.sort(makeSorter(({ balance }) => balance?.toNumber() ?? 0));
  }

  if (sort === Sorts.RANK_NOMINATION_TARGETS && nominators) {
    sorted.sort(makeSorter(({ nominations }) => nominations?.targets.length ?? 0));
  }

  if (sort === Sorts.RANK_OWN_STAKE) {
    sorted.sort(makeSorter(({ totalStake }) => totalStake?.toNumber() ?? 0));
  }

  if (sort === Sorts.RANK_LAST_UPDATES && nominators) {
    sorted.sort(makeSorter(({ nominations }) => nominations?.submittedIn?.toNumber() ?? 0));
  }

  if (sortFromMax) {
    sorted.reverse();
  }

  return sorted;
}

function calculateTotalBalance (accounts: DeriveBalancesAccount[]): BN[] {
  return accounts.map(({ freeBalance, reservedBalance }) => freeBalance.add(reservedBalance.toBn()));
}

function useNominators (): Nominator[] | undefined {
  const { api } = useApi();
  const nominatorStakes = useNominatorStakes();
  const nominations = useNominations();
  const nominatorIds = useMemo(() => nominations?.map(([id]) => id), [nominations]);
  const balanceTotals = useCall<BN[]>(api.derive.balances.votingBalances, [nominatorIds], { transform: calculateTotalBalance });

  return useMemo(
    () => nominations?.map(([id, noms], index) => {
      const stakes = nominatorStakes?.filter(({ nominator }) => nominator === id);

      return {
        accountId: id,
        balance: balanceTotals?.[index],
        nominations: noms,
        stakes,
        totalStake: stakes?.reduce((stake, { value }) => value ? stake.add(value) : stake, BN_ZERO)
      };
    }),
    [nominations, nominatorStakes, balanceTotals]
  );
}

function Nominators ({ ownStashes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ isQueryFiltered, nameFilter }, setNameFilter] = useState(DEFAULT_NAME);
  const [toggles, setToggle] = useSavedFlags('staking:nominators', { withAccountNominations: false, withIdentity: false });
  const nominators = useNominators();
  const nominatorIds = useMemo(() => nominators?.map(({ accountId }) => accountId), [nominators]);
  const teamMultipliers = useCall<[StorageKey<[AccountId32]>, undefined][]>(api.query.xxCustody.custodyAccounts.entries);
  const teamMultipliersAddresses = useMemo(
    () => teamMultipliers?.map(([accountId]) => accountId[0]?.toString()),
    [teamMultipliers]
  );
  const identities = useIdentities(nominatorIds);
  const ownStashIds = useMemo(() => ownStashes?.map(({ stashId }) => stashId), [ownStashes]);

  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay();

  const filtered = useMemo(
    () => applyFilters(
      toggles.withIdentity,
      toggles.withAccountNominations,
      identities,
      nominators,
      teamMultipliersAddresses,
      ownStashIds
    ),
    [
      toggles.withIdentity,
      toggles.withAccountNominations,
      identities,
      nominators,
      teamMultipliersAddresses,
      ownStashIds
    ]
  );

  const labels = useRef<Record<Sorts, string>>({
    [Sorts.RANK_BALANCE]: t('total balance'),
    [Sorts.RANK_OWN_STAKE]: t('current own stake'),
    [Sorts.RANK_NOMINATION_TARGETS]: t('nominations'),
    [Sorts.RANK_LAST_UPDATES]: t('last updated (era)')
  });

  const [{ sortBy, sortFromMax }, setSortState] = useState<SortState>({
    sortBy: Sorts.RANK_OWN_STAKE,
    sortFromMax: true
  });

  const sorted = useMemo(
    () => sortNominators({ sortBy, sortFromMax }, filtered),
    [sortBy, sortFromMax, filtered]
  );

  const displayList = isQueryFiltered
    ? nominators
    : sorted;

  const paginated = usePagination(displayList, { perPage: 50 });
  const finalList = nameFilter ? displayList : paginated.items;

  const _setNameFilter = useCallback(
    (nameFilter: string, isQueryFiltered: boolean) => setNameFilter({ isQueryFiltered, nameFilter }),
    []
  );

  const headers = useMemo(
    () => [
      [t('nominators'), 'start'],
      ...(sortKeys.map((key) => [
        <>{labels.current[key]} <Icon icon={sortBy === key ? (sortFromMax ? 'chevron-down' : 'chevron-up') : 'minus'} /></>,
        `${sorted ? `isClickable ${sortBy === key ? 'highlight--border' : ''} number` : 'number'}`,
        1,
        () => {
          setSortState((state) => ({
            sortBy: key,
            sortFromMax: state.sortBy === key ? !state.sortFromMax : state.sortFromMax
          }));
        }
      ]))
    ],
    [t, sortBy, sortFromMax, sorted]
  );

  const filter = useMemo(() => (
    <div>
      <Filtering
        nameFilter={nameFilter}
        setNameFilter={_setNameFilter}
        setWithIdentity={setToggle.withIdentity}
        withIdentity={toggles.withIdentity}
      >
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('your nominations')}
          onChange={setToggle.withAccountNominations}
          value={toggles.withAccountNominations}
        />
      </Filtering>
    </div>
  ), [nameFilter, _setNameFilter, setToggle, t, toggles]);

  return (
    <>
      <Table
        empty={(nominators && t<string>('No active nominators'))}
        emptySpinner={
          <>
            {!nominators && <div>{t<string>('Retrieving nominators')}</div>}
          </>
        }
        filter={filter}
        header={headers}
      >
        {!isLoading && !!finalList && finalList.map((nominator) => (
          <NominatorRow
            key={nominator.accountId}
            nameFilter={nameFilter}
            nominator={nominator}
          />
        ))}
      </Table>
      {!nameFilter && <PaginationAdvanced {...paginated} />}
    </>
  );
}

export default React.memo(Nominators);
