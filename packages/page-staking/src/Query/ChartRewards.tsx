// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveEraPoints, DeriveEraRewards, DeriveEraSlashes, DeriveOwnSlashes, DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useMemo } from 'react';

import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_ZERO, formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';
import { balanceToNumber, calculateAverage } from './util';

const COLORS_REWARD = ['#8c2200', '#5d392d', '#008c22', '#acacac'];

function extractRewards (
  erasRewards: DeriveEraRewards[] = [],
  ownSlashes: DeriveOwnSlashes[] = [],
  ownPoints: DeriveStakerPoints[] = [],
  erasPoints: DeriveEraPoints[] = [],
  erasSlashes: DeriveEraSlashes[] = [],
  divisor: BN
): ChartInfo {
  const labels: string[] = [];
  const slashSet: LineDataEntry = [];
  const rewardSet: LineDataEntry = [];
  const avgRewardSet: LineDataEntry = [];
  const avgSlashSet: LineDataEntry = [];

  erasRewards.forEach(({ era, eraReward }): void => {
    const points = ownPoints.find((points) => points.era.eq(era));
    const slashed = ownSlashes.find((slash) => slash.era.eq(era));
    const reward = points?.eraPoints.gtn(0)
      ? balanceToNumber(points.points.mul(eraReward).div(points.eraPoints), divisor)
      : 0;
    const slash = slashed
      ? balanceToNumber(slashed.total, divisor)
      : 0;

    const networkPoints = erasPoints.find((points) => points.era.eq(era));
    const networkSlashes = erasSlashes.find((slashes) => slashes.era.eq(era));

    const networkPointAverage = calculateAverage(Object.values(networkPoints?.validators ?? {}));
    const slashes = { ...networkSlashes?.nominators, ...networkSlashes?.validators };
    const networkSlashAverage = balanceToNumber(calculateAverage(Object.values(slashes)) ?? BN_ZERO, divisor);
    const networkRewardAverage = points?.eraPoints.gtn(0)
      ? balanceToNumber(networkPointAverage.mul(eraReward).div(points.eraPoints), divisor)
      : 0;

    labels.push(era.toNumber().toString());
    rewardSet.push(reward);
    avgRewardSet.push(networkRewardAverage);
    avgSlashSet.push(networkSlashAverage);
    slashSet.push(slash);
  });

  return {
    chart: [slashSet, avgSlashSet, rewardSet, avgRewardSet],
    labels
  };
}

function ChartRewards ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const ownSlashes = useCall<DeriveOwnSlashes[]>(api.derive.staking.ownSlashes, params);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);
  const eraPoints = useCall<DeriveEraPoints[]>(api.derive.staking.erasPoints);
  const erasRewards = useCall<DeriveEraRewards[]>(api.derive.staking.erasRewards);
  const erasSlashes = useCall<DeriveEraSlashes[]>(api.derive.staking.erasSlashes);

  const { currency, divisor } = useMemo(() => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), []);

  const { chart, labels } = useMemo(
    () => extractRewards(erasRewards, ownSlashes, stakerPoints, eraPoints, erasSlashes, divisor),
    [erasRewards, ownSlashes, stakerPoints, eraPoints, erasSlashes, divisor]
  );

  const legends = useMemo(() => [
    t<string>('{{currency}} slashed', { replace: { currency } }),
    t<string>('{{currency}} slashes network average', { replace: { currency } }),
    t<string>('{{currency}} rewards', { replace: { currency } }),
    t<string>('{{currency}} rewards network average', { replace: { currency } })
  ], [currency, t]);

  return (
    <div className='staking--Chart'>
      <h1>{t<string>('rewards & slashes')}</h1>
      {labels.length
        ? (
          <Chart.Line
            colors={COLORS_REWARD}
            labels={labels}
            legends={legends}
            values={chart}
          />
        )
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(ChartRewards);
