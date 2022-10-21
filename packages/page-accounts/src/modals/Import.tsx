// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import type { AccountInfo, ModalProps } from '../types';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { AddressRow, Button, InputFile, MarkError, MarkWarning, Modal, Password } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate';

const AddressesContainer = styled.div`
  margin-left: 2rem;
  max-height: 20rem;
  overflow: auto;
  background: var(--bg-input);
  border: 1px solid var(--border-input);
  border-radius: 0.28571429rem;
  font-size: 1rem;
  padding: 0.67857143em 1em;
`;

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface PassState {
  isPassValid: boolean;
  password: string;
}

const acceptedFormats = ['application/json', 'text/plain'].join(', ');

function parseAccountInfo (json: KeyringPair$Json): AccountInfo {
  try {
    const { address, meta: { genesisHash, name }, type } = keyring.createFromJson(json);

    return {
      address,
      genesisHash,
      name,
      type
    } as AccountInfo;
  } catch (e) {
    console.error(e);
    throw new Error((e as Error).message);
  }
}

function isKeyringPairs$Json (json: KeyringPair$Json | KeyringPairs$Json): json is KeyringPairs$Json {
  return (json.encoding.content).includes('batch-pkcs8');
}

function Import ({ className = '', onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isDevelopment } = useApi();
  const [isBusy, setIsBusy] = useState(false);
  const [accountsInfo, setAccountsInfo] = useState<AccountInfo[]>([]);
  const [isFileError, setFileError] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [{ isPassValid, password }, setPass] = useState<PassState>({ isPassValid: false, password: '' });
  const apiGenesisHash = useMemo(() => isDevelopment ? null : api.genesisHash.toHex(), [api, isDevelopment]);
  const genesisHashes = accountsInfo?.map(({ genesisHash }) => genesisHash).join(',');

  const accountsContainDifferentGenesis = useMemo(
    () => genesisHashes.split(',').some((g) => g !== apiGenesisHash),
    [
      genesisHashes,
      apiGenesisHash
    ]
  );

  const [file, setFile] = useState<KeyringPair$Json | KeyringPairs$Json | undefined>(undefined);

  const _onChangeFile = useCallback(
    (file: Uint8Array): void => {
      setAccountsInfo(() => []);

      let json: KeyringPair$Json | KeyringPairs$Json | undefined;

      try {
        json = JSON.parse(u8aToString(file)) as KeyringPair$Json | KeyringPairs$Json;
        setFile(json);
      } catch (e) {
        console.error(e);
        setFileError(true);
        setWarning((e as Error).message ? (e as Error).message : (e as Error).toString());
      }

      if (json === undefined) {
        return;
      }

      if (isKeyringPairs$Json(json)) {
        json.accounts.forEach((account) => {
          setAccountsInfo((old) => [...old, {
            address: account.address,
            genesisHash: account.meta.genesisHash,
            name: account.meta.name
          } as AccountInfo]);
        });
      } else {
        try {
          const accountInfo = parseAccountInfo(json);

          setAccountsInfo((old) => [...old, accountInfo]);
        } catch (e) {
          console.error(e);
          setFileError(true);
          setWarning((e as Error).message ? (e as Error).message : (e as Error).toString());
        }
      }
    }, []
  );

  const _onChangePass = useCallback(
    (password: string) => setPass({ isPassValid: keyring.isPassValid(password), password }),
    []
  );

  const _onSave = useCallback(
    (): void => {
      if (!file || !password) {
        return;
      }

      setIsBusy(true);
      const status: Partial<ActionStatus> = { action: 'import' };

      try {
        if (isKeyringPairs$Json(file)) {
          keyring.restoreAccounts(file, password);
          file.accounts.forEach(({ address }) => {
            onStatusChange({
              account: address,
              action: 'import',
              message: t<string>('account imported'),
              status: 'success'
            });
          });
        } else {
          keyring.restoreAccount(file, password);
          status.account = file.address;
          status.message = t<string>('account imported');
          onStatusChange(status as ActionStatus);
        }
      } catch (e) {
        setPass((state: PassState) => ({ ...state, isPassValid: false }));
        status.status = 'error';
        status.message = (e as Error).message;
        console.error(e);
        onStatusChange(status as ActionStatus);
      }

      setIsBusy(false);

      if (status.status !== 'error') {
        onClose();
      }
    },
    [file, onClose, onStatusChange, password, t]
  );

  return (
    <Modal
      className={className}
      header={t<string>('Add via backup file')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          {accountsInfo?.length > 0 && (
            <AddressesContainer>
              {accountsInfo.map(({ address, name }) => (
                <AddressRow
                  className='ui--Labelled-content'
                  defaultName={name || null}
                  key={address}
                  noDefaultNameOpacity
                  value={address || null}
                />
              ))}
            </AddressesContainer>
          )}
        </Modal.Columns>
        <Modal.Columns hint={t<string>('Supply a backed-up JSON file, encrypted with your account-specific password.')}>
          <InputFile
            accept={acceptedFormats}
            autoFocus
            className='full'
            help={t<string>('Select the JSON key file that was downloaded when you created the account. This JSON file contains your private key encrypted with your password.')}
            isError={isFileError}
            label={t<string>('backup file')}
            onChange={_onChangeFile}
            withLabel
          />
          {accountsContainDifferentGenesis && (
            <MarkWarning content={t<string>('One or more accounts imported were originally generated on a different network than the one you are currently connected to. Once imported ensure you toggle the "allow on any network" option for the account to keep it visible on the current network.')} />
          )}
        </Modal.Columns>

        <Modal.Columns hint={t<string>('The password previously used to encrypt this account.')}>
          <Password
            className='full'
            help={t<string>('Type the password chosen at the account creation. It was used to encrypt your account\'s private key in the backup file.')}
            isError={!isPassValid}
            label={t<string>('password')}
            onChange={_onChangePass}
            onEnter={_onSave}
            value={password}
          />
        </Modal.Columns>
        <Modal.Columns>
          {warning && (
            <MarkError content={warning} />
          )}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sync'
          isBusy={isBusy}
          isDisabled={!file || !isPassValid}
          label={t<string>('Import')}
          onClick={_onSave}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Import);
