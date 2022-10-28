// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';

import { useApi } from '@polkadot/react-hooks';
import { InputAddress, InputCmixAddress, MarkWarning, Modal, TxButton } from '@polkadot/react-components';

import { useTranslation } from '../../translate';
import InputValidateCmix from '../Account/InputValidateCmix';

interface Props {
  onClose: () => void;
  stashId: string;
  controllerId: string;
}

function SetCmixId ({ onClose, stashId, controllerId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [cmixId, setCmixId] = useState<string | null>(null);
  const [cmixError, setCmixError] = useState<boolean>(false);

  const cmixHint = t<string>('The cMix ID is the identifier of your cMix Node in the xx network. Validators are required to have a cMix ID set on-chain. This can be found in your cmix-IDF.json file, under the field “hexNodeID”.');

  const _setCmixAddressError = useCallback(
    (error: string | null) => setCmixError(!!error),
    []
  );

  return (
    <Modal
      className='staking--BondExtra'
      header={t<string>('Set Cmix ID')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <InputAddress
            defaultValue={stashId}
            isDisabled
            label={t<string>('stash account')}
          />
          <InputAddress
            defaultValue={controllerId}
            isDisabled
            label={t<string>('controller account')}
          />
        </Modal.Columns>
        {
          <Modal.Columns hint={cmixHint}>
            <InputCmixAddress
              cmixId={cmixId}
              isError={cmixError}
              onChange={setCmixId}
              includeToggle={false}
            />
            <InputValidateCmix
              onError={_setCmixAddressError}
              required={true}
              value={cmixId}
            />
            <MarkWarning
              content={t<string>('Please make sure you set your cMix ID correctly. If you don’t, you will need to fully UNBOND your stash, and wait for the bonding duration specified above, before you can correct your cMix ID. Be aware you will NOT EARN any potential rewards during this unbonding period.')}
            />
          </Modal.Columns>
        }
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={stashId}
          icon='sign-in-alt'
          isDisabled={cmixError}
          label={t<string>('Submit')}
          onStart={onClose}
          params={[cmixId]}
          tx={api.tx.staking.setCmixId}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(SetCmixId);
