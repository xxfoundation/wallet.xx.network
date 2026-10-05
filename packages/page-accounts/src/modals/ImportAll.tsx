// Copyright 2017-2025 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@polkadot/keyring/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import type { ModalProps } from '../types.js';

import React, { useCallback, useMemo, useState } from 'react';

import { AddressRow, Button, InputFile, MarkError, MarkWarning, Modal, Password, styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { nextTick, u8aToString } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import { parseImportFile, prepareBatchRestore, previewBatchRestore, storedAccounts } from './importFile.js';

interface Props extends ModalProps {
  className?: string;
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}

interface TPassword {
  account: string, isPassTouched: boolean, password: string
}

type FileAccount = (KeyringPair$Json | KeyringPair);

type File = FileAccount[]

const acceptedFormats = ['application/json', 'text/plain'];

function isInBrowserAccount (pair: FileAccount): boolean {
  return !pair.meta.isInjected && !pair.meta.isHardware && !pair.meta.isMultisig && !!(pair as KeyringPair$Json).encoded && !!(pair as KeyringPair$Json).encoding;
}

function ImportAll ({ className, onClose, onStatusChange }: Props): React.ReactElement | null {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [allBrowserAccountPassword, setAllBrowserAccountPassword] = useState<TPassword[]>([]);
  // a multi-account export from before the 2025 upgrade, restored with one export password
  const [batch, setBatch] = useState<KeyringPairs$Json | null>(null);
  const [batchPassword, setBatchPassword] = useState('');
  const { api, isDevelopment } = useApi();
  const apiGenesisHash = useMemo(() => isDevelopment ? null : api.genesisHash.toHex(), [api, isDevelopment]);

  // accounts tied to another network disappear on the next page load, as the old wallet warned
  const otherNetworkNames = useMemo(
    (): string[] => {
      const accounts: { address: string, meta: KeyringPair$Meta }[] = batch ? batch.accounts : (file || []);

      return apiGenesisHash
        ? accounts.filter(({ meta }) => !!meta.genesisHash && meta.genesisHash !== apiGenesisHash).map(({ address, meta }) => meta.name || address)
        : [];
    },
    [apiGenesisHash, batch, file]
  );

  // accounts already in this browser that the multi-account file would replace
  const replacedNames = useMemo(
    () => batch ? previewBatchRestore(batch, storedAccounts(keyring)) : [],
    [batch]
  );

  const _onChangeFile = useCallback(
    (file: Uint8Array) => {
      setError(null);
      setFile(null);
      setBatch(null);
      setBatchPassword('');
      setAllBrowserAccountPassword([]);

      try {
        const parsed = parseImportFile(u8aToString(file));

        if (parsed.kind === 'batch') {
          setBatch(parsed.batch);
        } else {
          setFile(parsed.accounts);
        }
      } catch (error) {
        console.error(error);
        setError((error as Error).message ? (error as Error).message : (error as Error).toString());
      }
    },
    []
  );

  const _onChangeBatchPassword = useCallback(
    (password: string): void => {
      setBatchPassword(password);
      setError(null);
    },
    []
  );

  const _onImportButtonClick = useCallback(() => {
    setIsBusy(true);
    nextTick((): void => {
      const status: Partial<ActionStatus> = { action: 'import' };

      try {
        let imported = 0;
        let skipped: string[] = [];

        if (batch) {
          const prepared = prepareBatchRestore(batch, batchPassword, storedAccounts(keyring));

          keyring.restoreAccounts(prepared.batch, batchPassword);
          imported = prepared.imported;
          skipped = prepared.skipped;
        }

        file?.forEach((pair) => {
          if (isInBrowserAccount(pair)) {
            const keyringPair = keyring.createFromJson(pair as KeyringPair$Json);
            const password = allBrowserAccountPassword.find((e) => e.account === pair.address)?.password || '';

            keyring.addPair(keyringPair, password);
          } else {
            keyring.addExternal(pair.address, pair.meta);
          }
        });

        const names = skipped.join(', ');

        status.status = 'success';

        if (!skipped.length) {
          status.message = t('all accounts imported');
        } else if (imported) {
          status.message = t('accounts imported; kept the key already in this browser for {{names}}', { replace: { names } });
        } else {
          status.message = t('nothing imported; kept the key already in this browser for {{names}}', { replace: { names } });
        }
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
        console.error(error);

        if (batch) {
          setError((error as Error).message);
        }
      }

      setIsBusy(false);
      onStatusChange(status as ActionStatus);

      if (status.status !== 'error') {
        onClose();
      }
    });
  }, [allBrowserAccountPassword, batch, batchPassword, file, onClose, onStatusChange, t]);

  const _onBatchEnter = useCallback(
    (): void => {
      if (!isBusy && !error && keyring.isPassValid(batchPassword)) {
        _onImportButtonClick();
      }
    },
    [_onImportButtonClick, batchPassword, error, isBusy]
  );

  return (
    <Modal
      className={className}
      header={t('import all accounts')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t('Supply a backed-up JSON file')}>
          <InputFile
            accept={acceptedFormats}
            className='full'
            isError={!file && !batch}
            label={t('backup file')}
            onChange={_onChangeFile}
            withLabel
          />
          {!!otherNetworkNames.length && (
            <MarkWarning content={t('Tied to another network, so hidden after the next page reload: {{names}}. To keep one visible, open its menu after importing and switch on "only this network".', { replace: { names: otherNetworkNames.join(', ') } })} />
          )}
        </Modal.Columns>
        {file && file.some(isInBrowserAccount) &&
          <Modal.Columns hint={t('Provide password for browser accounts')}>
            <BrowserAccounts
              allPassword={allBrowserAccountPassword}
              pairs={file}
              setAllPassword={setAllBrowserAccountPassword}
            />
          </Modal.Columns>
        }
        {batch && (
          <Modal.Columns hint={t('Enter the password chosen when this file was exported. In-browser accounts still sign with their own passwords.')}>
            {batch.accounts.map(({ address, meta }) => (
              <BrowserAccountsDiv key={address}>
                <AddressRow
                  defaultName={meta.name || null}
                  noDefaultNameOpacity
                  value={address}
                />
              </BrowserAccountsDiv>
            ))}
            <Password
              autoFocus
              className='full'
              isError={!!error}
              label={t('export password')}
              onChange={_onChangeBatchPassword}
              onEnter={_onBatchEnter}
              value={batchPassword}
            />
            {!!replacedNames.length && (
              <MarkWarning content={t('These accounts are already in this browser and will be replaced by the copy in this file: {{names}}', { replace: { names: replacedNames.join(', ') } })} />
            )}
          </Modal.Columns>
        )}
        <Modal.Columns>
          {error && (
            <MarkError content={error} />
          )}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sync'
          isBusy={isBusy}
          isDisabled={(batch ? !keyring.isPassValid(batchPassword) : !file) || !!error}
          label={t('Import')}
          onClick={_onImportButtonClick}
        />
      </Modal.Actions>

    </Modal>
  );
}

const BrowserAccounts = ({ allPassword, pairs, setAllPassword }: { pairs: FileAccount[], allPassword: TPassword[], setAllPassword: React.Dispatch<React.SetStateAction<TPassword[]>> }) => {
  const { t } = useTranslation();

  const _onChangePass = useCallback(
    (account: string, password: string): void => {
      setAllPassword((prev) => {
        return [
          ...prev.filter((e) => e.account !== account),
          { account, isPassTouched: true, password }
        ];
      });
    },
    [setAllPassword]
  );

  return pairs.map((pair) => {
    const { address: account } = pair;
    const { isPassTouched, password } = allPassword.find((a) => a.account === account) || { isPassTouched: false, password: '' };
    const isPassValid = keyring.isPassValid(password);

    return isInBrowserAccount(pair) && <BrowserAccountsDiv key={account}>
      <AddressRow
        defaultName={pair?.meta.name || null}
        noDefaultNameOpacity
        value={pair?.address || null}
      />
      <Password
        autoFocus
        isError={isPassTouched && !isPassValid}
        label={t('password')}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(password) => _onChangePass(account, password)}
        value={password}
      />
    </BrowserAccountsDiv>;
  });
};

const BrowserAccountsDiv = styled.div`
  width: 100%;
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-inline: 2rem;

  div:nth-child(2) {width: 100%;}
`;

export default React.memo(ImportAll);
