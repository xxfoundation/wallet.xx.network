// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext } from 'react';

import { Keyring } from '@polkadot/keyring';
import { Button, StatusContext } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import CreateModal from '../../modals/Create';
import { useTranslation } from '../../translate';
import { Element } from '../index';

interface Props {
  className?: string;
  standardMnemonic: string;
  onFinish: () => void;
}

function Step3 ({ className = '', onFinish, standardMnemonic }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { queueAction } = useContext(StatusContext);
  // Construct the keying, using ss58 format 55, which is registered for xx network
  const localKeyring = new Keyring({ ss58Format: 55, type: 'sr25519' });
  const wallet = localKeyring.addFromMnemonic(standardMnemonic);
  const [isCreateOpen, toggleCreate, setIsCreateOpen] = useToggle();

  const _openCreateModal = useCallback(() => setIsCreateOpen(true), [setIsCreateOpen]);

  const _onFinish = useCallback(() => {
    queueAction && queueAction({
      action: 'create',
      message: 'Wallet Generation completed!',
      status: 'success'
    });
    onFinish();
  }, [onFinish, queueAction]);

  const onCreateAccount = useCallback(() => {
    queueAction && queueAction({
      action: 'create',
      message: 'Wallet Generation completed!',
      status: 'success'
    });
    window.location.hash = '/accounts';
  }, [queueAction]);

  return (
    <div
      className={className}
      style={{ margin: '1em', width: '95%' }}
    >
      <h2>{t<string>('Finish Wallet Setup')}</h2>
      {isCreateOpen && (
        <CreateModal
          onClose={toggleCreate}
          onStatusChange={onCreateAccount}
          seed={standardMnemonic}
        />
      )}
      <Element
        header={t<string>('xx network PUBLIC address')}
        noIndex={true}
        value={wallet.address}
      />
      <div style={{ margin: '2em 0' }}>
        {!keyring.genesisHash
          ? <p>You can now add your wallet in <a onClick={onCreateAccount}><i>Accounts Page.</i></a></p>
          : <p>You can now add your wallet to <i>Accounts</i> in this web app.</p>
        }
        <div style={{ textAlign: 'end' }}>
          {keyring.genesisHash &&
            <Button
              icon='plus'
              isDisabled={!standardMnemonic}
              label={t<string>('Add Wallet to Accounts')}
              onClick={_openCreateModal}
            />
          }
          <Button
            icon='close'
            isDisabled={!standardMnemonic}
            label={t<string>('Finish Setup')}
            onClick={_onFinish}
          />
        </div>
        <p>
          {t<string>('To setup a hardware wallet: ')}
          <a
            className='ml-1'
            href='https://learn.xx.network/tools/webWallet/accounts/ledger'
            rel='noreferrer'
            target='_blank'
          >
            https://learn.xx.network/tools/webWallet/accounts/ledger
          </a>
        </p>
      </div>
    </div>);
}

export default Step3;
