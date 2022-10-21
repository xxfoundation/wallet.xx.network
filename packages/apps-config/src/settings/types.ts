// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface Option {
  info?: string;
  isDisabled?: boolean;
  isHeader?: boolean;
  text: React.ReactNode;
  value: string | number;
}

export interface LinkOption extends Option {
  isCustom?: boolean | undefined;
  dnslink?: string;
  genesisHash?: string;
  genesisHashRelay?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  isSpaced?: boolean;
  isLightClient?: boolean;
  linked?: LinkOption[];
  paraId?: number;
  textBy: string;
}
