// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveOwnExposure } from '@polkadot/api-derive/types';
import type { LineData, Props } from './types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_ZERO, formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Chart from './Chart.js';
import { balanceToNumber } from './util.js';

const COLORS_STAKE = [undefined, '#8c2200', '#acacac'];

function extractStake (labels: string[], exposures: DeriveOwnExposure[], divisor: BN, erasTotalStake?: any[], validatorCount?: number): LineData {
  const ownStakeSet = new Array<number>(labels.length);
  const electedStakeSet = new Array<number>(labels.length);
  const avgSet = new Array<number>(labels.length);

  exposures.forEach(({ era, exposureMeta, exposurePaged }): void => {
    // Handle both Option<T> and direct value formats
    const expPaged: any = exposurePaged?.isSome ? exposurePaged.unwrap() : exposurePaged;
    const expMeta: any = exposureMeta?.isSome ? exposureMeta.unwrap() : exposureMeta;
    
    // Extract own stake (validator's own capital)
    const ownField = expPaged?.own || expMeta?.own;
    const ownValue = ownField
      ? (typeof ownField.toBn === 'function' ? ownField.toBn() : (ownField.unwrap ? ownField.unwrap() : BN_ZERO))
      : BN_ZERO;
    const ownStake = balanceToNumber(ownValue, divisor);
    
    // Extract elected stake (total including nominators)
    // Support both new format (pageTotal) and old format (total)
    const totalField = expPaged?.pageTotal || expPaged?.total || expMeta?.total;
    const totalValue = totalField
      ? (typeof totalField.toBn === 'function' ? totalField.toBn() : (totalField.unwrap ? totalField.unwrap() : BN_ZERO))
      : BN_ZERO;
    const electedStake = balanceToNumber(totalValue, divisor);
    
    const index = labels.indexOf(String(era));

    if (index !== -1) {
      ownStakeSet[index] = ownStake;
      electedStakeSet[index] = electedStake;
      
      // Calculate network average stake for this era
      if (erasTotalStake && erasTotalStake[index] && validatorCount) {
        const eraStake = erasTotalStake[index];
        // Handle both Option<Balance> and direct Balance types
        const totalStake = eraStake?.unwrapOr ? eraStake.unwrapOr(BN_ZERO) : (eraStake || BN_ZERO);
        avgSet[index] = totalStake.gtn && totalStake.gtn(0) && validatorCount > 0
          ? Math.ceil(balanceToNumber(totalStake, divisor) / validatorCount * 100) / 100
          : 0;
      }
    }
  });

  return [ownStakeSet, electedStakeSet, avgSet];
}

function ChartStake ({ labels, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const ownExposures = useCall<DeriveOwnExposure[]>(api.derive.staking.ownExposures, params);
  const [values, setValues] = useState<LineData>([]);
  
  // Fetch network-wide total stake for all eras
  const eras = useMemo(() => labels.map((l) => api.registry.createType('EraIndex', l)), [api, labels]);
  const erasTotalStake = useCall<any[]>(api.query.staking.erasTotalStake?.multi, [eras]);
  
  // Get current validator count
  const validatorCount = useCall<number>(api.query.staking.validatorCount);

  const { currency, divisor } = useMemo(
    () => ({
      currency: formatBalance.getDefaults().unit,
      divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
    }),
    []
  );

  useEffect(
    () => setValues([]),
    [validatorId]
  );

  useEffect(
    () => ownExposures && setValues(extractStake(labels, ownExposures, divisor, erasTotalStake, validatorCount)),
    [labels, divisor, ownExposures, erasTotalStake, validatorCount]
  );

  const legends = useMemo(() => [
    t('{{currency}} own stake', { replace: { currency } }),
    t('{{currency}} elected stake', { replace: { currency } }),
    t('{{currency}} network average', { replace: { currency } })
  ], [currency, t]);

  return (
    <Chart
      colors={COLORS_STAKE}
      labels={labels}
      legends={legends}
      title={t('elected stake')}
      values={values}
    />
  );
}

export default React.memo(ChartStake);
