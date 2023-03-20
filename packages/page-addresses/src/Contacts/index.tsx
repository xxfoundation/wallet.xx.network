// Copyright 2017-2023 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ComponentProps as Props } from '../types';

import { saveAs } from 'file-saver';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, FilterInput, SummaryBox, Table } from '@polkadot/react-components';
import { useAddresses, useFavorites, useLoadingDelay, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import CreateModal from '../modals/Create';
import { useTranslation } from '../translate';
import Address from './Address';
import FileInputButton from './FileInputButton';

type SortedAddress = { address: string; isFavorite: boolean };

const STORE_FAVS = 'accounts:favorites';

function Overview ({ className = '', onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAddresses } = useAddresses();
  const [isCreateOpen, toggleCreate] = useToggle(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS);
  const [sortedAddresses, setSortedAddresses] = useState<SortedAddress[] | undefined>();
  const [filterOn, setFilter] = useState<string>('');
  const isLoading = useLoadingDelay();

  const headerRef = useRef([
    [t('contacts'), 'start', 2],
    [t('transactions'), 'number media--1500'],
    [t('balances'), 'balances'],
    [undefined, 'media--1400'],
    []
  ]);

  useEffect((): void => {
    setSortedAddresses(
      allAddresses
        .map((address): SortedAddress => ({ address, isFavorite: favorites.includes(address) }))
        .sort((a, b): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : b.isFavorite
              ? 1
              : -1
        )
    );
  }, [allAddresses, favorites]);

  const importAddresses = useCallback((json: unknown) => {
    let success = false;

    if (typeof json === 'object' && json !== null) {
      success = Object.entries(json).every(([address, name]) => {
        let result = true;

        if (typeof name === 'string') {
          try {
            keyring.decodeAddress(address); // acts as a test to see if its valid
            keyring.saveAddress(address, { genesisHash: keyring.genesisHash, name: name, tags: [] });
          } catch (err) {
            result = false;
          }
        } else {
          result = false;
        }

        return result;
      });
    }

    const count = success ? Object.keys(json as Record<string, unknown>).length : 0;
    const status: ActionStatus = {
      action: 'import',
      message: success
        ? t<string>('Successfully imported {{count}} addresses', { count })
        : t<string>('Importing contacts has failed'),
      status: success ? 'success' : 'error'
    };

    onStatusChange(status);
  }, [onStatusChange, t]);

  const exportAddresses = useCallback(
    (): void => {
      const addressInfos = allAddresses.map(
        (addr) => keyring.getAddress(addr)
      );

      const json = addressInfos.reduce((acc: Record<string, string>, cur) => ({
        ...(cur !== undefined && { [cur?.address]: cur?.meta.name || '' }),
        ...acc
      }), {});

      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      saveAs(blob, `exported_contacts_${Date.now()}.json`);

      onStatusChange({
        action: 'export',
        message: t<string>('{{count}} contacts successfully exported', { count: Object.keys(json).length }),
        status: 'success'
      });
    },
    [allAddresses, onStatusChange, t]
  );

  return (
    <div className={className}>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onStatusChange}
        />
      )}
      <SummaryBox className='summary-box-contacts'>
        <section>
          <FilterInput
            filterOn={filterOn}
            label={t<string>('filter by name or tags')}
            setFilter={setFilter}
          />
        </section>
        <Button.Group>
          <Button
            icon='plus'
            label={t<string>('Add contact')}
            onClick={toggleCreate}
          />
          <FileInputButton
            onChange={importAddresses}
          />
          <Button
            icon='share-square'
            label={t<string>('Export')}
            onClick={exportAddresses}
          />
        </Button.Group>
      </SummaryBox>
      <Table
        empty={!isLoading && sortedAddresses && t<string>('no addresses saved yet, add any existing address')}
        header={headerRef.current}
        withCollapsibleRows
      >
        {!isLoading && sortedAddresses?.map(({ address, isFavorite }): React.ReactNode => (
          <Address
            address={address}
            filter={filterOn}
            isFavorite={isFavorite}
            key={address}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Overview)`
  .summary-box-contacts {
    align-items: center;
  }
`);
