// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { NodeLocationContext } from './context.js';
import useNodeLocationMap from './useNodeLocationMap.js';

const NodeLocationsProvider: React.FC<{ children: JSX.Element | JSX.Element[] }> = ({ children }) => {
  const nodeLocations = useNodeLocationMap();

  return (
    <NodeLocationContext.Provider value={{ nodeLocations }}>
      {children}
    </NodeLocationContext.Provider>
  );
};

export default NodeLocationsProvider;
