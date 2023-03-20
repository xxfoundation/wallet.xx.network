// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { Forcing } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Elapsed } from '@polkadot/react-query';
import { BN, BN_ONE, formatNumber } from '@polkadot/util';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  withEra?: boolean;
  withSession?: boolean;
}

// Number of sessions in an era used for the election
const ELECTION_FACTOR = 1.5;

function SummarySession ({ className, withEra = true, withSession = true }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session?.progress);
  const forcing = useCall<Forcing>(api.query.staking?.forceEra);
  const eraIndex = sessionInfo ? sessionInfo.activeEra : null;
  const sessionIndex = sessionInfo ? sessionInfo.currentIndex : null;

  const nextEra = eraIndex ? eraIndex?.toNumber() + 1 : 0;
  const eraAfterNext = nextEra + 1;
  const help = t<string>('Remaining time to be part of the Election for next era ({{nextEra}}). If the cutoff has passed (100%), any changes will only be reflected on era {{eraAfterNext}}.', { eraAfterNext, nextEra });
  const eraLabel = eraIndex && t<string>('era {{eraIndex}}', { eraIndex });
  const sessionLabel = sessionInfo?.isEpoch
    ? sessionIndex && t<string>('epoch {{sessionIndex}}', { sessionIndex })
    : sessionIndex && t<string>('session {{sessionIndex}}', { sessionIndex });
  const activeEraStart = sessionInfo?.activeEraStart.unwrapOr(null);

  const electionLabel = t<string>('election cutoff ({{nextEra}})', { nextEra });
  const electionCutoffLength = sessionInfo ? sessionInfo.eraLength.toNumber() - sessionInfo.sessionLength.toNumber() * ELECTION_FACTOR : 0;
  const electionCutOffProgress = sessionInfo ? (sessionInfo.eraProgress.toNumber() - electionCutoffLength > 0) ? electionCutoffLength : sessionInfo.eraProgress.toNumber() : 0;

  return (
    <>
      {sessionInfo && (
        <>
          {withSession && (
            sessionInfo.sessionLength.gt(BN_ONE)
              ? (
                <CardSummary
                  className={className}
                  label={sessionLabel}
                  progress={{
                    total: sessionInfo.sessionLength,
                    value: sessionInfo.sessionProgress,
                    withTime: true
                  }}
                />
              )
              : (
                <CardSummary label={sessionLabel}>
                  #{formatNumber(sessionInfo.currentIndex)}
                  {withEra && activeEraStart && <div className='isSecondary'>&nbsp;</div>}
                </CardSummary>
              )
          )}
          {electionCutOffProgress && forcing && !forcing.isForceNone && withEra && (
            sessionInfo.sessionLength.gt(BN_ONE)
              ? (
                <CardSummary
                  className={className}
                  help={help}
                  label={electionLabel}
                  progress={{
                    total: forcing.isForceAlways ? sessionInfo.sessionLength : new BN(electionCutoffLength),
                    value: forcing.isForceAlways ? sessionInfo.sessionProgress : new BN(electionCutOffProgress),
                    withTime: true
                  }}
                />
              )
              : (
                <CardSummary
                  className={className}
                  label={electionLabel}
                >
                  #{formatNumber(sessionInfo.activeEra)}
                  {activeEraStart && (
                    <Elapsed
                      className='isSecondary'
                      value={activeEraStart}
                    >
                      &nbsp;{t('elapsed')}
                    </Elapsed>
                  )}
                </CardSummary>
              )
          )}
          {forcing && !forcing.isForceNone && withEra && (
            sessionInfo.sessionLength.gt(BN_ONE)
              ? (
                <CardSummary
                  className={className}
                  label={eraLabel}
                  progress={{
                    total: forcing.isForceAlways ? sessionInfo.sessionLength : sessionInfo.eraLength,
                    value: forcing.isForceAlways ? sessionInfo.sessionProgress : sessionInfo.eraProgress,
                    withTime: true
                  }}
                />
              )
              : (
                <CardSummary
                  className={className}
                  label={eraLabel}
                >
                  #{formatNumber(sessionInfo.activeEra)}
                  {activeEraStart && (
                    <Elapsed
                      className='isSecondary'
                      value={activeEraStart}
                    >
                      &nbsp;{t('elapsed')}
                    </Elapsed>
                  )}
                </CardSummary>
              )
          )}
        </>
      )}
    </>
  );
}

export default React.memo(SummarySession);
