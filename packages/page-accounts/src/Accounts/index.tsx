// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { PalletIdentityRegistration } from '@polkadot/types/lookup';
import type { Option } from '@polkadot/types-codec';
import type { KeyringAddress } from '@polkadot/ui-keyring/types';
import type { BN } from '@polkadot/util';
import type { AccountBalance, Delegation, SortedAccount } from '../types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { InjectionPreference } from '@polkadot/react-api/types';
import { Button, FilterInput, MarkWarning, PaginationAdvanced, SortDropdown, SummaryBox, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useDelegations, useFavorites, useIpfs, useLedger, useLoadingDelay, usePagination, useProxies, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { BN_ZERO } from '@polkadot/util';

import CreateModal from '../modals/Create';
import ExportModal from '../modals/Export';
import ImportModal from '../modals/Import';
import Ledger from '../modals/Ledger';
import Multisig from '../modals/MultisigCreate';
import Proxy from '../modals/ProxiedAdd';
import Qr from '../modals/Qr';
import { useTranslation } from '../translate';
import { sortAccounts, SortCategory, sortCategory } from '../util';
import Account from './Account';
import BannerClaims from './BannerClaims';
import Summary from './Summary';

interface Balances {
  accounts: Record<string, AccountBalance>;
  summary?: AccountBalance;
}

interface Props {
  className?: string;
  onStatusChange: (status: ActionStatus) => void;
}

interface SortControls {
  sortBy: SortCategory;
  sortFromMax: boolean;
}

const DEFAULT_SORT_CONTROLS: SortControls = { sortBy: 'date', sortFromMax: true };

const STORE_FAVS = 'accounts:favorites';

function filterAccounts (accounts: (KeyringAddress | undefined)[], identities?: Option<PalletIdentityRegistration>[], filter?: string) {
  const _filter = filter?.toLowerCase() ?? '';

  return accounts.filter((acct, index) => {
    const tags = acct?.meta.tags as string[];
    const identity: PalletIdentityRegistration | undefined = identities?.[index]?.unwrapOr(undefined);

    const display = identity?.info?.display.toString() ?? '';
    const nameMatches = acct?.meta.name?.toLowerCase().includes(_filter);
    const displayMatches = display?.toLowerCase().includes(_filter);
    const tagsMatches = tags?.reduce((result: boolean, tag: string): boolean => {
      return result || tag.toLowerCase().includes(_filter);
    }, false);

    return (_filter?.length ?? 0) === 0 || nameMatches || displayMatches || tagsMatches;
  });
}

const dropdownOptions = sortCategory.map((x) => ({ text: x, value: x }));

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, canInject, loadInjectionPreference } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const identities = useCall<Option<PalletIdentityRegistration>[]>(api.query.identity?.identityOf.multi, [allAccounts]);
  const keyringAccounts = useMemo(() => allAccounts.map((acct) => keyring.getAccount(acct)), [allAccounts]);
  const [filterOn, setFilter] = useState<string>('');
  const filtered = useMemo(
    () => filterAccounts(keyringAccounts, identities, filterOn),
    [filterOn, identities, keyringAccounts]
  );
  const { isIpfs } = useIpfs();
  const { isLedgerEnabled } = useLedger();
  const [isCreateOpen, toggleCreate, setIsCreateOpen] = useToggle();
  const [isImportOpen, toggleImport] = useToggle();
  const [isLedgerOpen, toggleLedger] = useToggle();
  const [isMultisigOpen, toggleMultisig] = useToggle();
  const [isProxyOpen, toggleProxy] = useToggle();
  const [isQrOpen, toggleQr] = useToggle();
  const [isExportOpen, toggleExport] = useToggle();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [balances, setBalances] = useState<Balances>({ accounts: {} });
  const [sortedAccounts, setSorted] = useState<SortedAccount[]>([]);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortControls>(DEFAULT_SORT_CONTROLS);
  const delegations = useDelegations();
  const proxies = useProxies();
  const isLoading = useLoadingDelay();
  const paginated = usePagination(sortedAccounts, { perPage: 5 });
  const finalList = filterOn ? sortedAccounts : paginated.items;

  const favoritesMap = useMemo(() => Object.fromEntries(favorites.map((x) => [x, true])), [favorites]);

  const accountsWithInfo = useMemo(() =>
    filtered?.map((account, index): SortedAccount => {
      const deleg = delegations && delegations[index]?.isDelegating && delegations[index]?.asDelegating;
      const delegation: Delegation | undefined = (deleg && {
        accountDelegated: deleg.target.toString(),
        amount: deleg.balance,
        conviction: deleg.conviction
      }) || undefined;
      const address = account?.address ?? '';

      return {
        account,
        address,
        delegation,
        isFavorite: favoritesMap[address] ?? false
      };
    }), [filtered, delegations, favoritesMap]);

  const accountsMap = useMemo(() => {
    const ret: Record<string, SortedAccount> = {};

    accountsWithInfo.forEach(function (x) {
      ret[x.address] = x;
    });

    return ret;
  }, [accountsWithInfo]);

  const header = useRef([
    [t('accounts'), 'start', 3],
    [t('type')],
    [t('transactions'), 'media--1500'],
    [t('balances'), 'balances'],
    []
  ]);

  useEffect((): void => {
    setSorted((sortedAccounts) =>
      [
        ...sortedAccounts.map((x) => accountsWithInfo.find((y) => x.address === y.address)).filter((x): x is SortedAccount => !!x),
        ...accountsWithInfo.filter((x) => !sortedAccounts.find((y) => x.address === y.address))
      ]
    );
  }, [accountsWithInfo]);

  const accounts = balances.accounts;

  useEffect((): void => {
    setSorted((sortedAccounts) =>
      sortAccounts(sortedAccounts, accountsMap, accounts, sortBy, sortFromMax));
  }, [accountsWithInfo, accountsMap, accounts, sortBy, sortFromMax]);

  const _injectAccountsFromExtension = useCallback(() => {
    loadInjectionPreference(InjectionPreference.Inject);
  }, [loadInjectionPreference]);

  const _setBalance = useCallback(
    (account: string, balance: AccountBalance) =>
      setBalances(({ accounts }: Balances): Balances => {
        accounts[account] = balance;

        const aggregate = (key: keyof AccountBalance) =>
          Object.values(accounts).reduce((total: BN, value: AccountBalance) => total.add(value[key]), BN_ZERO);

        return {
          accounts,
          summary: {
            bonded: aggregate('bonded'),
            locked: aggregate('locked'),
            redeemable: aggregate('redeemable'),
            total: aggregate('total'),
            transferrable: aggregate('transferrable'),
            unbonding: aggregate('unbonding')
          }
        };
      }),
    []
  );

  const _openCreateModal = useCallback(() => setIsCreateOpen(true), [setIsCreateOpen]);

  const accountComponents = useMemo(() => {
    const ret: Record<string, React.ReactNode> = {};

    accountsWithInfo?.forEach(({ account, address, delegation, isFavorite }, index) => {
      ret[address] =
        <Account
          account={account}
          delegation={delegation}
          filter={filterOn}
          isFavorite={isFavorite}
          key={`${index}:${address}`}
          proxy={proxies?.[index]}
          setBalance={_setBalance}
          toggleFavorite={toggleFavorite}
        />;
    });

    return ret;
  }, [accountsWithInfo, filterOn, proxies, _setBalance, toggleFavorite]);

  const onDropdownChange = useCallback((item: SortCategory) => setSortBy({ sortBy: item, sortFromMax }), [sortFromMax]);

  const onSortDirectionChange = useCallback(() => setSortBy({ sortBy, sortFromMax: !sortFromMax }), [sortBy, sortFromMax]);

  const banner = <>If you previously used this web wallet and do not find your accounts preloaded here, please visit {' '}
    <a
      href='https://explorer.xx.network'
      rel='noopener noreferrer'
      target='_blank'
    >explorer.xx.network</a> and come back.</>;

  return (
    <div className={className}>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      {isImportOpen && (
        <ImportModal
          onClose={toggleImport}
          onStatusChange={onStatusChange}
        />
      )}
      {isLedgerOpen && (
        <Ledger onClose={toggleLedger} />
      )}
      {isMultisigOpen && (
        <Multisig
          onClose={toggleMultisig}
          onStatusChange={onStatusChange}
        />
      )}
      {isProxyOpen && (
        <Proxy
          onClose={toggleProxy}
          onStatusChange={onStatusChange}
        />
      )}
      {isQrOpen && (
        <Qr
          onClose={toggleQr}
          onStatusChange={onStatusChange}
        />
      )}
      {isExportOpen && (
        <ExportModal
          onClose={toggleExport}
          onStatusChange={onStatusChange}
        />
      )}
      <BannerClaims />
      <Summary balance={balances.summary} />
      <SummaryBox className='account-summary-box'>
        <section
          className='dropdown-section'
          data-testid='sort-by-section'
        >
          <SortDropdown
            defaultValue={sortBy}
            label={t<string>('sort by')}
            onChange={onDropdownChange}
            onClick={onSortDirectionChange}
            options={dropdownOptions}
            sortDirection={sortFromMax ? 'ascending' : 'descending'}
          />
          <FilterInput
            filterOn={filterOn}
            label={t<string>('filter by name or tags')}
            setFilter={setFilter}
          />
        </section>
        <Button.Group>
          <Button
            icon='plus'
            isDisabled={!canInject}
            label={t<string>('Inject from extension')}
            onClick={_injectAccountsFromExtension}
          />
          <Button
            icon='plus'
            isDisabled={isIpfs}
            label={t<string>('Add account')}
            onClick={_openCreateModal}
          />
          <Button
            icon='plus'
            isDisabled={isIpfs}
            label={t<string>('Import')}
            onClick={toggleImport}
          />
          <Button
            icon='qrcode'
            label={t<string>('Add via Qr')}
            onClick={toggleQr}
          />
          {isLedgerEnabled && (
            <>
              <Button
                icon='project-diagram'
                label={t<string>('Add via Ledger')}
                onClick={toggleLedger}
              />
            </>
          )}
          <Button
            icon='plus'
            isDisabled={!(api.tx.multisig || api.tx.utility) || !hasAccounts}
            label={t<string>('Multisig')}
            onClick={toggleMultisig}
          />
          <Button
            icon='plus'
            isDisabled={!api.tx.proxy || !hasAccounts}
            label={t<string>('Proxied')}
            onClick={toggleProxy}
          />
          <Button
            icon='share-square'
            isDisabled={!hasAccounts}
            label={t<string>('Export')}
            onClick={toggleExport}
          />
        </Button.Group>
      </SummaryBox>
      <MarkWarning
        content={banner}
      />
      <Table
        empty={!isLoading && finalList && t<string>("You don't have any accounts. Some features are currently hidden and will only become available once you have accounts.")}
        header={header.current}
        withCollapsibleRows
      >
        {!isLoading &&
          finalList?.map(({ address }) => accountComponents[address])
        }
      </Table>
      {!filterOn && <PaginationAdvanced {...paginated} />}
    </div>
  );
}

export default React.memo(styled(Overview)`
  .ui--Dropdown {
    width: 25rem;
  }

  .account-summary-box {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    margin: 1em;
  }

  .dropdown-section {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`);
