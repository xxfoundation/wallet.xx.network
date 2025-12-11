// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { LineData, Props } from './types.js';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Chart from './Chart.js';

const COLORS_POINTS = [undefined, '#acacac'];

function extractPoints (labels: string[], points: DeriveStakerPoints[], erasRewardPoints?: any[], validatorCount?: number): LineData {
  const avgSet = new Array<number>(labels.length);
  const idxSet = new Array<number>(labels.length);

  points.forEach(({ era, points }): void => {
    const index = labels.indexOf(String(era));
    
    if (index !== -1) {
      idxSet[index] = points.toNumber();
      
      // Calculate network average for this era
      if (erasRewardPoints && erasRewardPoints[index] && validatorCount) {
        const eraRewards = erasRewardPoints[index];
        const totalPoints = eraRewards.total?.toNumber() || 0;
        avgSet[index] = totalPoints > 0 && validatorCount > 0
          ? Math.ceil((totalPoints / validatorCount) * 100) / 100
          : 0;
      }
    }
  });

  return [idxSet, avgSet];
}

function ChartPoints ({ labels, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);
  const [values, setValues] = useState<LineData>([]);
  
  // Fetch network-wide era reward points for all eras
  const eras = useMemo(() => labels.map((l) => api.registry.createType('EraIndex', l)), [api, labels]);
  const erasRewardPoints = useCall<any[]>(api.query.staking.erasRewardPoints?.multi, [eras]);
  
  // Get current validator count
  const validatorCount = useCall<number>(api.query.staking.validatorCount);

  useEffect(
    () => setValues([]),
    [validatorId]
  );

  useEffect(
    () => stakerPoints && setValues(extractPoints(labels, stakerPoints, erasRewardPoints, validatorCount)),
    [labels, stakerPoints, erasRewardPoints, validatorCount]
  );

  const legendsRef = useRef([
    t('points'),
    t('network average')
  ]);

  return (
    <Chart
      colors={COLORS_POINTS}
      labels={labels}
      legends={legendsRef.current}
      title={t('era points')}
      values={values}
    />
  );
}

export default React.memo(ChartPoints);
