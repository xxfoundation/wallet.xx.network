// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ValidateInfo } from './types';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Dropdown, InputAddress, InputNumber, MarkError, Modal } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN, BN_HUNDRED as MAX_COMM, BN_ONE, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId: string;
  onChangeCommission?: (isCommissionValid: boolean) => void;
  minCommission?: BN;
  onChange: (info: ValidateInfo) => void;
  stashId: string;
  withSenders?: boolean;
}

const COMM_MUL = new BN(1e2);
const DEFAULT_LENGTH = new BN(1e9);
const DECIMALS = 2;

function Validate ({ className = '', controllerId, minCommission, onChange, onChangeCommission, stashId, withSenders }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const minComm = minCommission && minCommission.mul(COMM_MUL).div(DEFAULT_LENGTH) || BN_ONE;
  const [commission, setCommission] = useState(minComm);
  const [maxLengthWithDecimals, setMaxLengthWithDecimals] = useState<number>(3);
  const [allowNoms, setAllowNoms] = useState(true);

  const blockedOptions = useRef([
    { text: t('Yes, allow nominations'), value: true },
    { text: t('No, block all nominations'), value: false }
  ]);

  useEffect((): void => {
    try {
      onChange({
        validateTx: api.tx.staking.validate({
          blocked: !allowNoms,
          commission
        })
      });
    } catch {
      onChange({ validateTx: null });
    }
  }, [api, allowNoms, commission, onChange]);

  const _setCommission = useCallback(
    (value?: BN) => {
      if (value) {
        setMaxLengthWithDecimals(value.div(DEFAULT_LENGTH).toString().split('.')[0].length + 1 + DECIMALS);
      }

      value && setCommission(
        value.isZero()
          ? minComm // small non-zero set to avoid isEmpty
          : value.div(COMM_MUL)
      );
    },
    []
  );

  const commErr = minCommission && commission.lt(minCommission);

  useEffect((): void => {
    onChangeCommission && onChangeCommission(!commErr)
  }, [commErr, onChangeCommission]);

  return (
    <div className={className}>
      {withSenders && (
        <Modal.Columns hint={t<string>('The stash and controller pair. This transaction, managing preferences, will be sent from the controller.')}>
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
      )}
      <Modal.Columns hint={t<string>('The commission is deducted from all rewards before the remainder is split with nominators.')}>
        <InputNumber
          bitLength={128}
          commission={true}
          isError={commErr}
          help={t<string>('The percentage reward (2-100) that should be applied for the validator')}
          isSi
          label={t<string>('reward commission percentage')}
          maxLength={maxLengthWithDecimals}
          maxValue={MAX_COMM.mul(DEFAULT_LENGTH)}
          onChange={_setCommission}
        />
        {commErr && (
          <MarkError content={t<string>('The commission is below the on-chain minimum of {{p}}%', { replace: { p: (minCommission.mul(COMM_MUL).div(DEFAULT_LENGTH).toNumber()).toFixed(2) } })} />
        )}
      </Modal.Columns>
      {isFunction(api.tx.staking.kick) && (
        <Modal.Columns hint={t<string>('The validator can block any new nominations. By default it is set to allow all nominations.')}>
          <Dropdown
            defaultValue={true}
            help={t<string>('Does this validator allow nominations or is it blocked for all')}
            label={t<string>('allows new nominations')}
            onChange={setAllowNoms}
            options={blockedOptions.current}
          />
        </Modal.Columns>
      )}
    </div>
  );
}

export default React.memo(Validate);
