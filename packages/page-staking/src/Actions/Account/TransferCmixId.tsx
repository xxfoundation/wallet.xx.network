// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletStakingStakingLedger } from '@polkadot/types/lookup';

import React, { useCallback, useState } from 'react';

import { InputAddress, MarkError, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { DisplayValue } from '@polkadot/react-query';

import { useTranslation } from '../../translate';

interface Props {
  onClose: () => void;
  stashId: string;
  cmixId: string;
  ledgers: PalletStakingStakingLedger[];
  stashes: string[];
}

function TransferCmixId ({ cmixId, ledgers, onClose, stashId, stashes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [dest, setDest] = useState<string | null>(null);
  const [destErrorNoCmixId, setDestErrorNoCmixId] = useState<boolean>(false);
  const [destErrorNotStash, setDestErrorNotStash] = useState<boolean>(false);

  const cmixHint = t<string>('The cMix ID is the identifier of your cMix Node in the xx network. Validators are required to have a cMix ID set on-chain. This can be found in your cmix-IDF.json file, under the field “hexNodeID”.');

  const _setDest = useCallback(
    (address: string | null) => {
      const hasNoCmixId = ledgers
        .filter((elem) => elem.stash.toString() === address)
        .some((elem) => !elem.cmixId.isEmpty);

      setDestErrorNoCmixId(hasNoCmixId);

      const isNotStash = !stashes.some((elem) => elem === address);

      setDestErrorNotStash(isNotStash);
      setDest(address);
    },
    [ledgers, stashes]
  );

  return (
    <Modal
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
              label={t<string>('destination stash account')}
              onChange={_setDest}
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
