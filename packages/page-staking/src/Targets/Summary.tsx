// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { Balance } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall, useTotalStakeableIssuance } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  avgStaked?: BN;
  custodyRewardsActive: boolean;
  lastEra?: BN;
  lowStaked?: BN;
  minNominated?: BN;
  minNominatorBond?: BN;
  numNominators?: number;
  numValidators?: number;
  stakedReturn: number;
  totalIssuance?: BN;
  totalStaked?: BN;
}

interface ProgressInfo {
  hideValue: true;
  total: BN;
  value: BN;
}

const OPT_REWARD = {
  transform: (optBalance: Option<Balance>) =>
    optBalance.unwrapOrDefault()
};

function getProgressInfo (value?: BN, total?: BN): ProgressInfo | undefined {
  return value && total && !total.isZero()
    ? {
      hideValue: true,
      total,
      value
    }
    : undefined;
}

function Summary ({ avgStaked, custodyRewardsActive, lastEra, lowStaked, minNominated, minNominatorBond, stakedReturn, totalIssuance, totalStaked }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const lastReward = useCall<BN>(lastEra && api.query.staking.erasValidatorReward, [lastEra], OPT_REWARD);
  const totalStakeableIssuance = useTotalStakeableIssuance();

  const helpReturns = t('Network overall staking return. This is calculated from the current staked ratio, current ideal interest and inflation parameters.');
  const helpStaked = t('Team multipliers are not counted in total staked, but impact staking returns');
  const helpLowest = t('Team multipliers are included in the lowest / avg staked numbers');

  const progressStake = useMemo(
    () => getProgressInfo(totalStaked, totalStakeableIssuance),
    [totalStakeableIssuance, totalStaked]
  );

  const progressAvg = useMemo(
    () => getProgressInfo(lowStaked, avgStaked),
    [avgStaked, lowStaked]
  );

  return (
    <SummaryBox>
      <section className='media--800'>
        {progressStake && (
          <CardSummary
            help={custodyRewardsActive && helpStaked}
            label={t<string>('total staked')}
            progress={progressStake}
          >
            <FormatBalance
              value={totalStaked}
              withSi
            />
            &nbsp;/&nbsp;<br />
            <FormatBalance
              value={totalStakeableIssuance}
              withSi
            />
          </CardSummary>
        )}
      </section>
      <section className='media--800'>
        {(stakedReturn > 0) && Number.isFinite(stakedReturn) && (
          <CardSummary
            help={helpReturns}
            label={t<string>('returns')}
          >
            {stakedReturn.toFixed(1)}%
          </CardSummary>
        )}
      </section>
      <section className='media--1000'>
        {progressAvg && (
          <CardSummary
            help={custodyRewardsActive && helpLowest}
            label={`${t<string>('lowest / avg staked')}`}
            progress={progressAvg}
          >
            <FormatBalance
              value={lowStaked}
              withCurrency={false}
              withSi
            />
            &nbsp;/&nbsp;
            <FormatBalance
              value={avgStaked}
              withSi
            />
          </CardSummary>
        )}
      </section>
      <section className='media--1600'>
        {minNominated?.gt(BN_ZERO) && (
          <CardSummary
            className='media--1600'
            label={
              minNominatorBond
                ? t<string>('min nominated / threshold')
                : t<string>('min nominated')}
          >
            <FormatBalance
              value={minNominated}
              withCurrency={!minNominatorBond}
              withSi
            />
            {minNominatorBond && (
              <>
                &nbsp;/&nbsp;
                <FormatBalance
                  value={minNominatorBond}
                  withSi
                />
              </>
            )}
          </CardSummary>
        )}
      </section>
      <section>
        {lastReward?.gt(BN_ZERO) && (
          <CardSummary label={t<string>('last reward')}>
            <FormatBalance
              value={lastReward}
              withSi
            />
          </CardSummary>
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
