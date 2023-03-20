// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

import { CUSTOM_ENDPOINT_KEY } from '@polkadot/apps-config';

const getCustomEndpoints = (): string[] => {
  try {
    const storedAsset = localStorage.getItem(CUSTOM_ENDPOINT_KEY);

    if (storedAsset) {
      return JSON.parse(storedAsset) as string[];
    }
  } catch (e) {
    console.error(e);
    // ignore error
  }

  return [];
};

interface HookReturnType {
  addCustomEndpoint: (endpoint: string) => void,
  customEndpoints: string[],
  removeCustomEndpoint: (endpoint: string) => void,
}

const useCustomEndpoints = (): HookReturnType => {
  const [customEndpoints, setCustomEndpoints] = useState<string[]>(() => getCustomEndpoints());

  const removeCustomEndpoint = (apiUrl: string) => {
    const newStoredCustomEndpoints = customEndpoints.filter((url) => url !== apiUrl);

    try {
      localStorage.setItem(CUSTOM_ENDPOINT_KEY, JSON.stringify(newStoredCustomEndpoints));
      setCustomEndpoints(getCustomEndpoints());
    } catch (e) {
      console.error(e);
      // ignore error
    }
  };

  const addCustomEndpoint = (apiUrl: string) => {
    try {
      localStorage.setItem(CUSTOM_ENDPOINT_KEY, JSON.stringify([...customEndpoints, apiUrl]));
      setCustomEndpoints(getCustomEndpoints());
    } catch (e) {
      console.error(e);
      // ignore error
    }
  };

  return {
    addCustomEndpoint,
    customEndpoints,
    removeCustomEndpoint
  };
};

export default useCustomEndpoints;
