// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { useApi } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function ChainInfo ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isApiReady } = useApi();

  return (
    <div className={className}>
      <div
        className='chain-info highlight--color-contrast'
      >
        <div className='info'>
          {isApiReady
            ? (
              <p style={{ fontWeight: 'bold' }}>{t<string>('xx wallet')}</p>
            )
            : (
              <p>{t<string>('Connecting...')}</p>
            )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(ChainInfo)`
  box-sizing: border-box;
  padding: 0rem 0.75rem;
  margin: 0;
  position: relative;
  z-index: 250;
  background-color: rgba(0,0,0,0.15);
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`);
