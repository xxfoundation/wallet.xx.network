/* eslint-disable header/header */

import { createContext } from 'react';

export const NodeLocationContext = createContext(
  {
    nodeLocations: {} as Record<string, string> | undefined
  }
);
