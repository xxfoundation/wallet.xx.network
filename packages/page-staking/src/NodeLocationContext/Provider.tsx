// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { NodeLocationContext } from './context';
import useNodeLocationMap from './useNodeLocationMap';

const NodeLocationsProvider: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
  const nodeLocations = useNodeLocationMap();

  return (
    <NodeLocationContext.Provider value={{ nodeLocations }}>
      {children}
    </NodeLocationContext.Provider>
  );
};

export default NodeLocationsProvider;
