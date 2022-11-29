// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Copyright 2017-2021 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Card } from '@polkadot/react-components';

import { useTranslation } from './translate';
import { addrToChecksum } from './util';

interface Props {
  className?: string;
  address?: string;
}

function ClaimError ({ address, className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <Card
      isError
    >
      <div className={className}>
        {t<string>('Your Ethereum account')}
        <h3>{address && addrToChecksum(address)}</h3>
        <>{t<string>('does not appear to have a valid claim. Make sure you are using the correct ETH account.')}</>
      </div>
    </Card>
  );
}

export const ClaimStyles = `
font-size: 1.15rem;
display: flex;
flex-direction: column;
justify-content: center;
min-height: 12rem;
align-items: center;
margin: 0 1rem;

h3 {
  font-family: monospace;
  font-size: 1.5rem;
  max-width: 100%;
  margin: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

h2 {
  margin: 0.5rem 0 2rem;
  font-family: monospace;
  font-size: 2.5rem;
  font-weight: 400;
}
`;

export default React.memo(styled(ClaimError)`${ClaimStyles}`);
