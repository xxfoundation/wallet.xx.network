// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveEraPoints, DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useMemo, useRef } from 'react';

import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { calculateAverage } from './util';
import { useTranslation } from '../translate';
import { BN_ZERO } from '@polkadot/util';

const COLORS_POINTS = [undefined, '#acacac'];

function extractPoints (points: DeriveStakerPoints[] = [], eraPoints: DeriveEraPoints[] = []): ChartInfo {
  const labels: string[] = [];
  const idxSet: LineDataEntry = [];
  const avgSet: LineDataEntry = [];

  points.forEach(({ era, points }): void => {
    labels.push(era.toNumber().toString());
    idxSet.push(points);

    const eraValidatorPoints = eraPoints.find((eraPoint) => eraPoint.era.eq(era));
    const average = eraValidatorPoints ? calculateAverage(Object.values(eraValidatorPoints.validators)) : BN_ZERO;
    avgSet.push(average);
  });

  return {
    chart: [idxSet, avgSet],
    labels
  };
}

function ChartPoints ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo<[string, boolean]>(() => [validatorId, false], [validatorId]);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);
  const eraPoints = useCall<DeriveEraPoints[]>(api.derive.staking.erasPoints, [false]);

  const { chart, labels } = useMemo(
    () => extractPoints(stakerPoints, eraPoints),
    [stakerPoints, eraPoints]
  );

  const legendsRef = useRef([
    t<string>('points'),
    t<string>('network average')
  ]);

  return (
    <div className='staking--Chart'>
      <h1>{t<string>('era points')}</h1>
      {labels.length
        ? (
          <Chart.Line
            colors={COLORS_POINTS}
            labels={labels}
            legends={legendsRef.current}
            values={chart}
          />
        )
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(ChartPoints);
