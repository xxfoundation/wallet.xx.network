// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerPrefs } from '@polkadot/api-derive/types';
import type { LineData, Props } from './types.js';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_BILLION } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Chart from './Chart.js';

const MULT = new BN(100 * 100);
const COLORS_POINTS = [undefined, '#acacac'];

function extractPrefs (labels: string[], prefs: DeriveStakerPrefs[], networkAvgCommission?: number): LineData {
  const avgSet = new Array<number>(labels.length);
  const idxSet = new Array<number>(labels.length);

  prefs.forEach(({ era, validatorPrefs }): void => {
    const comm = validatorPrefs.commission.unwrap().mul(MULT).div(BN_BILLION).toNumber() / 100;
    const index = labels.indexOf(String(era));

    if (index !== -1) {
      idxSet[index] = comm;
      // Use network average if available
      avgSet[index] = networkAvgCommission || 0;
    }
  });

  return [idxSet, avgSet];
}

function ChartPrefs ({ labels, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const stakerPrefs = useCall<DeriveStakerPrefs[]>(api.derive.staking.stakerPrefs, params);
  const [values, setValues] = useState<LineData>([]);
  
  // Fetch all validator commissions to calculate network average
  const allValidators = useCall<any[]>(api.query.staking.validators.entries);
  
  // Calculate network average commission
  const networkAvgCommission = useMemo(() => {
    if (!allValidators || allValidators.length === 0) {
      return 0;
    }
    
    const total = allValidators.reduce((sum, [, prefs]) => {
      const comm = prefs.commission.unwrap().mul(MULT).div(BN_BILLION).toNumber() / 100;
      return sum + comm;
    }, 0);
    
    return Math.ceil((total / allValidators.length) * 100) / 100;
  }, [allValidators]);

  useEffect(
    () => setValues([]),
    [validatorId]
  );

  useEffect(
    () => stakerPrefs && setValues(extractPrefs(labels, stakerPrefs, networkAvgCommission)),
    [labels, stakerPrefs, networkAvgCommission]
  );

  const legendsRef = useRef([
    t('commission'),
    t('network average')
  ]);

  // Set Y-axis to always show 0-100% range
  const chartOptions = useMemo(() => ({
    scales: {
      y: {
        max: 100,
        min: 0
      }
    }
  }), []);

  return (
    <Chart
      colors={COLORS_POINTS}
      labels={labels}
      legends={legendsRef.current}
      options={chartOptions}
      title={t('commission')}
      values={values}
    />
  );
}

export default React.memo(ChartPrefs);
