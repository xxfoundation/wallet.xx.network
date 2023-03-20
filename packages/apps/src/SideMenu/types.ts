// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface Network {
  icon?: string;
  isChild?: boolean;
  isCustom?: boolean;
  name: string;
  providers: {
    name: string;
    url: string;
  }[]
}

export interface Group {
  header: React.ReactNode;
  isDevelopment?: boolean;
  networks: Network[];
}
