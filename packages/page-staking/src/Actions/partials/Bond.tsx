// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';
import type { AmountValidateState } from '../types';
import type { BondInfo } from './types';

import React, { useCallback, useEffect, useState } from 'react';

import { Expander, InputAddress, InputBalance, InputCmixAddress, MarkInfo, MarkWarning, Modal, Static } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { BalanceFree, BlockToTime } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import InputValidateAmount from '../Account/InputValidateAmount';
import InputValidationController from '../Account/InputValidationController';
import useUnbondDuration from '../useUnbondDuration';
import { isHex } from '@polkadot/util';

interface Props {
  className?: string;
  isNominating?: boolean;
  isValidating?: boolean;
  minNominated?: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  onChange: (info: BondInfo) => void;
}

const EMPTY_INFO = {
  bondOwnTx: null,
  bondTx: null,
  controllerId: null,
  controllerTx: null,
  stashId: null
};

function Bond ({ className = '', isNominating, isValidating, minNominated, minNominatorBond, minValidatorBond, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [controllerError, setControllerError] = useState<boolean>(false);
  const [cmixError, setCmixError] = useState<boolean>(false);
  const [controllerId, setControllerId] = useState<string | null>(null);
  const [stashId, setStashId] = useState<string | null>(null);
  const [startBalance, setStartBalance] = useState<BN | null>(null);
  const stashBalance = useCall<DeriveBalancesAll>(api.derive.balances?.all, [stashId]);
  const bondedBlocks = useUnbondDuration();
  const [cmixId, setCmixId] = useState<string | null>(null);
  const [hasCmixId, setHasCmixId] = useToggle();

  const _setError = useCallback(
    (_: string | null, isFatal: boolean) => setControllerError(isFatal),
    []
  );

  const _validateCmixId = useCallback(
    (value: string) => {
      setCmixError(!isHex(value, 256));
      setCmixId(value);
    },
    []
  );

  useEffect((): void => {
    stashBalance && setStartBalance(
      stashBalance.freeBalance.gt(api.consts.balances.existentialDeposit)
        ? stashBalance.freeBalance.sub(api.consts.balances.existentialDeposit)
        : BN_ZERO
    );
  }, [api, stashBalance]);

  useEffect((): void => {
    setStartBalance(null);
  }, [stashId]);

  useEffect((): void => {
    onChange(
      (
        amount &&
        amount.gtn(0) &&
        !amountError?.error &&
        !controllerError &&
        !cmixError &&
        controllerId &&
        stashId)
        ? {
          bondOwnTx: api.tx.staking.bond(stashId, amount, cmixId),
          bondTx: api.tx.staking.bond(controllerId, amount, cmixId),
          controllerId,
          controllerTx: api.tx.staking.setController(controllerId),
          stashId
        }
        : EMPTY_INFO
    );
  }, [api, amount, amountError, controllerError, controllerId, stashId, onChange, cmixId, cmixError]);

  const hasValue = !!amount?.gtn(0);

  const cmixHint = t<string>('The cMix ID is the identifier of your cMix Node in the xx network. Validators are required to have a cMix ID set on-chain. This can be found in your cmix-IDF.json file, under the field “hexNodeID”.');

  return (
    <div className={className}>
      <Modal.Columns
        hint={
          <>
            <p>{t<string>('Think of the stash as your cold wallet and the controller as your hot wallet. Funding operations are controlled by the stash, any other non-funding actions by the controller itself.')}</p>
            {/* <p>{t<string>('To ensure optimal fund security using the same stash/controller is strongly discouraged, but not forbidden.')}</p> */}
          </>
        }
      >
        <InputAddress
          label={t<string>('stash account')}
          onChange={setStashId}
          type='account'
          value={stashId}
        />
        <InputAddress
          help={t<string>('The controller is the account that will be used to control any nominating or validating actions. Should not match another stash or controller.')}
          label={t<string>('controller account')}
          onChange={setControllerId}
          type='account'
          value={controllerId}
        />
        <InputValidationController
          accountId={stashId}
          controllerId={controllerId}
          onError={_setError}
        />
      </Modal.Columns>
      {startBalance && (
        <Modal.Columns
          hint={
            <>
              <p>{t<string>('The amount placed at-stake should not be your full available amount to allow for transaction fees.')}</p>
              <p>{t<string>('Once bonded, it will need to be unlocked/withdrawn and will be locked for at least the bonding duration.')}</p>
            </>
          }
        >
          <InputBalance
            autoFocus
            defaultValue={startBalance}
            help={t<string>('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the free amount available)')}
            isError={!hasValue || !!amountError?.error}
            label={t<string>('value bonded')}
            labelExtra={
              <BalanceFree
                label={<span className='label'>{t<string>('balance')}</span>}
                params={stashId}
              />
            }
            onChange={setAmount}
          />
          <InputValidateAmount
            controllerId={controllerId}
            isNominating={isNominating}
            minNominated={minNominated}
            minNominatorBond={minNominatorBond}
            minValidatorBond={minValidatorBond}
            onError={setAmountError}
            stashId={stashId}
            value={amount}
          />
          {bondedBlocks?.gtn(0) && (
            <Static
              help={t<string>('The bonding duration for any staked funds. Needs to be unlocked and withdrawn to become available.')}
              label={t<string>('on-chain bonding duration')}
            >
              <BlockToTime value={bondedBlocks} />
            </Static>
          )}
        </Modal.Columns>
      )}
      {isValidating && (
        <Modal.Columns hint={cmixHint}>
          <InputCmixAddress
            cmixId={cmixId}
            includeToggle={false}
            isError={cmixError}
            onChange={_validateCmixId}
          />
          <MarkWarning
            content={t<string>('Please make sure you set your cMix ID correctly. If you don’t, you will need to fully UNBOND your stash, and wait for the bonding duration specified above, before you can correct your cMix ID. Be aware you will NOT EARN any potential rewards during this unbonding period.')}
          />
        </Modal.Columns>
      )}
      <Modal.Columns hint={t<string>('')}>
        {isNominating && (
          <article style={{ margin: '0.5rem 0 0.5rem 2.25rem', padding: '1rem' }}>
            For more information please see the
            <a
              href='https://xxnetwork.wiki/index.php/How_to_Nominate'
              rel='noopener noreferrer'
              target='_blank'
            >{t<string>('Nomination Wiki')}</a>
          </article>
        )}
        <MarkInfo content={t<string>('Rewards (once paid) are deposited to the stash account, increasing the amount at stake.')} />
      </Modal.Columns>
      {!isValidating && (
        <>
          <Expander
            isPadded
            summary={t<string>('Advanced options')}
          >
            <Modal.Columns hint={cmixHint}>
              <InputCmixAddress
                cmixId={cmixId}
                enabled={hasCmixId}
                isError={cmixError}
                onChange={_validateCmixId}
                onEnabledChanged={setHasCmixId}
              />
              <MarkWarning
                content={t<string>('A cMix ID is not needed if you only wish to nominate. However, if at any point you decide to use this stash account to become a validator, you MUST specify your cMix ID. In that case, please make sure you set your cMix ID correctly. If you don’t, you will need to fully UNBOND your stash, and wait for the bonding duration specified above, before you can correct your cMix ID!')}
              />
            </Modal.Columns>
          </Expander>
        </>
      )}
    </div>
  );
}

export default React.memo(Bond);
