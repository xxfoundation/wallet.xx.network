// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveEraPrefs, DeriveStakerPrefs } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useMemo, useRef } from 'react';

import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_BILLION, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

const MULT = new BN(100 * 100);
const COLORS_POINTS = [undefined, '#acacac', ''];

function commToNumber (num: BN) {
  return num.mul(MULT).div(BN_BILLION).toNumber() / 100;
}

function extractPrefs (prefs: DeriveStakerPrefs[] = [], erasPrefs: DeriveEraPrefs[] = []): ChartInfo {
  const labels: string[] = [];
  const avgSet: LineDataEntry = [];
  const idxSet: LineDataEntry = [];

  prefs.forEach(({ era, validatorPrefs }): void => {
    const comm = commToNumber(validatorPrefs.commission.unwrap());
    const eraPrefs = erasPrefs.find(({ era: e }) => e.eq(era));

    const comms = Object.values(eraPrefs?.validators ?? {})
      .map((v) => v?.commission.unwrap());

    const networkValidatorCommsAvg = commToNumber(
      comms.reduce((a, b) => a.add(b), BN_ZERO).divn(comms.length)
    );

    labels.push(era.toNumber().toString());
    avgSet.push(networkValidatorCommsAvg);

    idxSet.push(comm);
  });

  return {
    chart: [idxSet, avgSet],
    labels
  };
}

function ChartPrefs ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const erasPrefs = useCall<DeriveEraPrefs[]>(api.derive.staking.erasPrefs);
  const stakerPrefs = useCall<DeriveStakerPrefs[]>(api.derive.staking.stakerPrefs, params);

  const { chart, labels } = useMemo(
    () => extractPrefs(stakerPrefs, erasPrefs),
    [stakerPrefs, erasPrefs]
  );

  const legendsRef = useRef([
    t<string>('commission'),
    t<string>('average')
  ]);

  return (
    <div className='staking--Chart'>
      <h1>{t<string>('commission')}</h1>
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

export default React.memo(ChartPrefs);
