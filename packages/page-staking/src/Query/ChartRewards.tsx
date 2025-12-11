// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveEraRewards, DeriveOwnSlashes, DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { LineData, Props } from './types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Chart from './Chart.js';
import { balanceToNumber } from './util.js';

const COLORS_REWARD = ['#8c2200', '#008c22', '#acacac'];

function extractRewards (labels: string[], erasRewards: DeriveEraRewards[], ownSlashes: DeriveOwnSlashes[], allPoints: DeriveStakerPoints[], divisor: BN, erasValidatorReward?: any[], validatorCount?: number): LineData {
  const slashSet = new Array<number>(labels.length);
  const rewardSet = new Array<number>(labels.length);
  const avgSet = new Array<number>(labels.length);

  erasRewards.forEach(({ era, eraReward }): void => {
    const points = allPoints.find((points) => points.era.eq(era));
    const slashed = ownSlashes.find((slash) => slash.era.eq(era));
    const reward = points?.eraPoints.gtn(0)
      ? balanceToNumber(points.points.mul(eraReward).div(points.eraPoints), divisor)
      : 0;
    const slash = slashed
      ? balanceToNumber(slashed.total, divisor)
      : 0;
    const index = labels.indexOf(String(era));

    if (index !== -1) {
      rewardSet[index] = reward;
      slashSet[index] = slash;
      
      // Calculate network average reward for this era
      if (erasValidatorReward && erasValidatorReward[index] && validatorCount) {
        const totalReward = erasValidatorReward[index].unwrapOr(new BN(0));
        avgSet[index] = totalReward.gtn(0) && validatorCount > 0
          ? Math.ceil(balanceToNumber(totalReward, divisor) / validatorCount * 100) / 100
          : 0;
      }
    }
  });

  return [slashSet, rewardSet, avgSet];
}

function ChartRewards ({ labels, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const ownSlashes = useCall<DeriveOwnSlashes[]>(api.derive.staking.ownSlashes, params);
  const erasRewards = useCall<DeriveEraRewards[]>(api.derive.staking.erasRewards);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);
  const [values, setValues] = useState<LineData>([]);
  
  // Fetch network-wide validator rewards for all eras
  const eras = useMemo(() => labels.map((l) => api.registry.createType('EraIndex', l)), [api, labels]);
  const erasValidatorReward = useCall<any[]>(api.query.staking.erasValidatorReward?.multi, [eras]);
  
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
    () => erasRewards && ownSlashes && stakerPoints && setValues(extractRewards(labels, erasRewards, ownSlashes, stakerPoints, divisor, erasValidatorReward, validatorCount)),
    [labels, divisor, erasRewards, ownSlashes, stakerPoints, erasValidatorReward, validatorCount]
  );

  const legends = useMemo(() => [
    t('{{currency}} slashed', { replace: { currency } }),
    t('{{currency}} rewards', { replace: { currency } }),
    t('{{currency}} network average', { replace: { currency } })
  ], [currency, t]);

  return (
    <Chart
      colors={COLORS_REWARD}
      labels={labels}
      legends={legends}
      title={t('rewards & slashes')}
      values={values}
    />
  );
}

export default React.memo(ChartRewards);
