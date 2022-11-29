// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/settings/types';
import type { Group } from './types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import store from 'store';
import styled from 'styled-components';

import { createWsEndpoints } from '@polkadot/apps-config';
import { settings } from '@polkadot/ui-settings';

import { useTranslation } from '../translate';
import AddCustomEndpoint from './AddCustomEndpoint';
import GroupDisplay from './Group';
import useCustomEndpoints from './useCustomEndpoints';

interface Props {
  className: string;
}

interface UrlState {
  apiUrl: string;
  hasUrlChanged: boolean;
  isUrlValid: boolean;
  groupIndex: number;
}

const STORAGE_AFFINITIES = 'network:affinities';

function isValidUrl (url: string): boolean {
  return (
    // some random length... we probably want to parse via some lib
    (url.length >= 7) &&
    // check that it starts with a valid ws identifier
    (url.startsWith('ws://') || url.startsWith('wss://'))
  );
}

function combineEndpoints (endpoints: LinkOption[]): Group[] {
  return endpoints.reduce((result: Group[], e): Group[] => {
    if (e.isHeader) {
      result.push({ header: e.text, isDevelopment: e.isDevelopment, networks: [] });
    } else {
      const prev = result[result.length - 1];
      const prov = { name: e.textBy, url: e.value as string };

      if (prev.networks[prev.networks.length - 1] && e.text === prev.networks[prev.networks.length - 1].name) {
        prev.networks[prev.networks.length - 1].providers.push(prov);
      } else {
        prev.networks.push({
          icon: e.info,
          isChild: e.isChild,
          isCustom: e.isCustom,
          name: e.text as string,
          providers: [prov]
        });
      }
    }

    return result;
  }, []);
}

function extractUrlState (apiUrl: string, groups: Group[]): UrlState {
  let groupIndex = groups.findIndex(({ networks }) =>
    networks.some(({ providers }) =>
      providers.some(({ url }) => url === apiUrl)
    )
  );

  if (groupIndex === -1) {
    groupIndex = groups.findIndex(({ isDevelopment }) => isDevelopment);
  }

  return {
    apiUrl,
    groupIndex,
    hasUrlChanged: settings.get().apiUrl !== apiUrl,
    isUrlValid: isValidUrl(apiUrl)
  };
}

function loadAffinities (groups: Group[]): Record<string, string> {
  return Object
    .entries<string>(store.get(STORAGE_AFFINITIES) as Record<string, string> || {})
    .filter(([network, apiUrl]) =>
      groups.some(({ networks }) =>
        networks.some(({ name, providers }) =>
          name === network && providers.some(({ url }) => url === apiUrl)
        )
      )
    )
    .reduce((result: Record<string, string>, [network, apiUrl]): Record<string, string> => ({
      ...result,
      [network]: apiUrl
    }), {});
}

function Endpoints ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const linkOptions = createWsEndpoints(t);
  const endpointGroups = useMemo(() => combineEndpoints(linkOptions), [linkOptions]);
  const { addCustomEndpoint, removeCustomEndpoint } = useCustomEndpoints();

  const [{ apiUrl, hasUrlChanged, isUrlValid }, setApiUrl] = useState<UrlState>(() => extractUrlState(settings.get().apiUrl, endpointGroups));
  const [affinities, setAffinities] = useState(() => loadAffinities(endpointGroups));

  const _setApiUrl = useCallback(
    (network: string, apiUrl: string): void => {
      setAffinities((affinities): Record<string, string> => {
        const newValue = { ...affinities, [network]: apiUrl };

        store.set(STORAGE_AFFINITIES, newValue);

        return newValue;
      });
      setApiUrl(extractUrlState(apiUrl, endpointGroups));
    },
    [endpointGroups]
  );

  const _onApply = useCallback(
    (): void => {
      settings.set({ ...(settings.get()), apiUrl });

      window.location.assign(`${window.location.origin}${window.location.pathname}?rpc=${encodeURIComponent(apiUrl)}${window.location.hash}`);
    },
    [apiUrl]
  );

  useEffect(() => {
    if (hasUrlChanged && isUrlValid && apiUrl) {
      _onApply();
    }
  }, [hasUrlChanged, isUrlValid, apiUrl, _onApply]);

  return (
    <div className={className}>
      {endpointGroups.map((group, index): React.ReactNode => (
        <GroupDisplay
          affinities={affinities}
          apiUrl={apiUrl}
          key={index}
          removeCustomEndpoint={removeCustomEndpoint}
          setApiUrl={_setApiUrl}
          value={group}
        />
      ))}
      <AddCustomEndpoint
        addEndpoint={addCustomEndpoint}
        endpoints={linkOptions}
      />
    </div>
  );
}

export default React.memo(styled(Endpoints)`
  .customButton {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .endpointCustom {
    color: orange;
    input {
      border-radius: 0;
    }
  }

  .endpointCustomWrapper {
    position: absolute;
    left: 0;
    width: 18rem;
  }
`);
