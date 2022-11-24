/* eslint-disable header/header */

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
