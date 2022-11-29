// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps } from '../types';

import { saveAs } from 'file-saver';
import React, { useCallback, useMemo, useState } from 'react';

import { Button, InputAddressMulti, Modal, Password } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';
import { useAccounts } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

function Export ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { allAccounts } = useAccounts();
  const selectableAccounts = useMemo(() => {
    return allAccounts.filter((addr) => !keyring.getPair(addr)?.meta.isInjected);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAccounts.join('')]);
  const [selected, setSelected] = useState<string[]>(selectableAccounts);
  const selectedKey = selected.join(',');

  const _export = useCallback(
    (): void => {
      setIsBusy(true);
      const selectedAccounts = selectedKey.split(',');

      keyring.backupAccounts(selectedAccounts, password)
        .then((exported) => {
          const blob = new Blob([JSON.stringify(exported)], { type: 'application/json; charset=utf-8' });

          saveAs(blob, `batch_exported_account_${Date.now()}.json`);

          onClose();
          onStatusChange({
            action: 'export',
            message: t<string>('{{count}} accounts successfully exported', { count: exported.accounts.length }),
            status: 'success'
          });
        })
        .catch((error: Error) => {
          console.error(error);
          setError(error.message);
          setIsBusy(false);
        });
    },
    [selectedKey, password, onClose, onStatusChange, t]
  );

  const onPassChange = useCallback(
    (password: string) => {
      setPassword(password);
      setError('');
    }
    , []);

  return (
    <Modal
      className={className}
      header={t<string>('Export accounts')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns
          hint={t<string>('Select which accounts you would like to export in a json format. All of them are selected by default.')}
        >
          <InputAddressMulti
            available={selectableAccounts}
            availableLabel={t<string>('exportable accounts')}
            defaultValue={selectableAccounts}
            help={t<string>('Filter available accounts based on name, address or short account index.')}
            maxCount={Number.POSITIVE_INFINITY}
            onChange={setSelected}
            valueLabel={t<string>('selected accounts to export')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('Choose a password that will be used to encrypt the json backup file. This is a different password than the one you sign transactions with. If you lose it you will lose access to the backup file forever.')}>
          <Password
            className='full'
            help={t<string>('Password for encrypting your json backup file.')}
            isError={!!error || !password}
            label={t<string>('password')}
            onChange={onPassChange}
            onEnter={_export}
            value={password}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sync'
          isBusy={isBusy}
          isDisabled={!password || selected.length === 0}
          label={t<string>('Export')}
          onClick={_export}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Export);
