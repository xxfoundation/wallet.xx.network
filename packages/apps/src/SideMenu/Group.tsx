// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Group } from './types';

import React from 'react';
import styled from 'styled-components';

import Network from './Network';

interface Props {
  affinities: Record<string, string>;
  apiUrl: string;
  children?: React.ReactNode;
  className?: string;
  index: number;
  isSelected: boolean;
  setApiUrl: (apiUrl: string) => void;
  removeCustomEndpoint: (url?: string) => void;
  value: Group;
}

function GroupDisplay ({ affinities,
  apiUrl,
  children,
  className = '',
  isSelected,
  removeCustomEndpoint,
  setApiUrl,
  value: { header, networks } }: Props): React.ReactElement<Props> {
  return (
    <div className={`${className}${isSelected ? ' isSelected' : ''}`}>
      {networks.length > 0 && (
        <div className='groupHeader highlight--color-contrast'>
          {header}
        </div>
      )}
      <div className='groupNetworks'>
        {networks.map((network, index): React.ReactNode => (
          <div
            key={index}
            style={{ position: 'relative' }}>
            <Network
              affinity={affinities[network.name]}
              apiUrl={apiUrl}
              removeCustomEndpoint={removeCustomEndpoint}
              setApiUrl={setApiUrl}
              value={network}
            />
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

export default React.memo(styled(GroupDisplay)`
  .groupHeader {
    line-height: 1;
    padding: 0.75rem 1rem;
    background-color: #232323;
    height: 2.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`);
