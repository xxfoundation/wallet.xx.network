// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createContext } from 'react';

export const NodeLocationContext = createContext(
  {
    nodeLocations: {} as Record<string, string> | undefined
  }
);
