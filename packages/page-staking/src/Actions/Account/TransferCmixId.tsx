// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import type { AccountId } from '@polkadot/types/interfaces';

import { useApi } from '@polkadot/react-hooks';
import { InputAddress, MarkError, Modal, TxButton, Static } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import { DisplayValue } from '@polkadot/react-query';

interface Props {
  onClose: () => void;
  stashId: string;
  cmixId: string;
  ledger: any[];
  stashes: string[];
}

function TransferCmixId({ onClose, stashId, cmixId, ledger, stashes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [dest, setDest] = useState<AccountId | null>(null);
  const [destErrorNoCmixId, setDestErrorNoCmixId] = useState<boolean>(false);
  const [destErrorNotStash, setDestErrorNotStash] = useState<boolean>(false);

  const cmixHint = t<string>('The cMix ID is the identifier of your cMix Node in the xx network. Validators are required to have a cMix ID set on-chain. This can be found in your cmix-IDF.json file, under the field “hexNodeID”.');

  const _setDest = useCallback(
    (address) => {
      ledger.filter(elem => elem.stash.toString() == address).some(elem => !elem.cmixId.isEmpty) ? setDestErrorNoCmixId(true) : setDestErrorNoCmixId(false)
      !stashes.some(elem => elem == address) ? setDestErrorNotStash(true) : setDestErrorNotStash(false)
      setDest(address)
    },
    [ledger]
  );

  return (
    <Modal
      className='staking--BondExtra'
      header={t<string>('Transfer Cmix ID')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={cmixHint}>
          <InputAddress
            defaultValue={stashId}
            isDisabled
            label={t<string>('stash account')}
          />
          <Static
            help={t<string>('The cMix ID is the identifier of your cMix Node in the xx network. Validators are required to have a cMix ID set on-chain. This can be found in your cmix-IDF.json file, under the field “hexNodeID”.')}
            label={t<string>('cmix ID')}
          >
            <DisplayValue value={cmixId.toString()} />
          </Static>
        </Modal.Columns>
        {
          <Modal.Columns>
            <InputAddress
              onChange={_setDest}
              label={t<string>('destination stash account')}
            />
            {destErrorNoCmixId &&
              <MarkError
                content={t<string>('The selected account already has a cmixID. Please choose a valid stash account to transfer the cmixID.')}
              />
            }
            {destErrorNotStash &&
              <MarkError
                content={t<string>('The selected account is not a stash account. Please choose a valid stash account to transfer the cmixID.')}
              />
            }
          </Modal.Columns>
        }
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={stashId}
          icon='sign-in-alt'
          isDisabled={destErrorNoCmixId || destErrorNotStash}
          label={t<string>('Submit')}
          onStart={onClose}
          params={[dest]}
          tx={api.tx.staking.transferCmixId}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(TransferCmixId);
