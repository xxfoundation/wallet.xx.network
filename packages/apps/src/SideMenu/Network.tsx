// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Network } from './types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, ChainImg, Icon } from '@polkadot/react-components';

import SideMenuItem from './SideMenuItem';
import Url from './Url';

interface Props {
  affinity?: string;
  apiUrl: string;
  className?: string;
  isCustom?: boolean;
  setApiUrl: (network: string, apiUrl: string) => void;
  removeCustomEndpoint: (url: string) => void;
  value: Network;
}

function NetworkDisplay ({ apiUrl, className = '', removeCustomEndpoint, setApiUrl, value: { icon, isCustom, name, providers } }: Props): React.ReactElement<Props> {
  const isSelected = useMemo(
    () => providers.some(({ url }) => url === apiUrl),
    [apiUrl, providers]
  );

  const _setApiUrl = useCallback(
    (apiUrl: string) => setApiUrl(name, apiUrl),
    [name, setApiUrl]
  );

  const [expanded, setExpanded] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    setIsDisabled(name.includes('coming soon'));
  }, [name]);

  const _setExpanded = useCallback(
    (state: boolean) => () => isDisabled || setExpanded(state),
    [isDisabled]
  );

  const _removeCustomUrl = useCallback(
    (url: string) => () => removeCustomEndpoint(url),
    [removeCustomEndpoint]
  );

  return (
    <div className={className}>
      <SideMenuItem
        className={`${isSelected ? 'selected' : ''} ${isDisabled ? 'highlight--color-disabled' : 'highlight--color-contrast'}`}
        onClick={_setExpanded(true)}
        onMouseEnter={_setExpanded(true)}
        onMouseLeave={_setExpanded(false)}
      >
        {isCustom || icon === 'local'
          ? (
            <Icon
              className={`${isDisabled ? 'endpoint-icon-disabled' : 'endpoint-icon'}`}
              icon='network-wired'
              size='2x'
            />
          )
          : (
            <ChainImg
              className={`${isDisabled ? 'endpoint-icon-disabled' : 'endpoint-icon'}`}
              logo={icon === 'local' ? 'empty' : (icon || 'empty')}
              withoutHl
            />
          )}
        <div className={`${isDisabled ? 'endpoint-disabled' : 'endpoint-label'}`}>
          {isCustom ? 'Custom' : name}
        </div>
        <div className={`endpoint-menu ${expanded ? 'expanded' : ''}`}>
          {providers.map(({ name, url }): React.ReactNode => (
            <div
              className='endpoint'
              key={url}
            >
              <Url
                apiUrl={apiUrl}
                label={name}
                setApiUrl={_setApiUrl}
                url={url}
              />
              {isCustom && (
                <Button
                  className='remove-endpoint-button'
                  icon='times'
                  onClick={_removeCustomUrl(url)}
                />
              )}
            </div>
          ))}
        </div>
      </SideMenuItem>
    </div>
  );
}

export default React.memo(styled(NetworkDisplay)`
  position: relative;

  .endpoint-menu {
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    background-color: var(--bg-menu);
    box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.15);

    &.expanded {
      display: block;
    }
  }

  .endpoint {
    position: relative;
    padding:  0.5rem 1rem;
    color: var(--color-text);
    display: flex;
    align-items: center;
    background-color: var(--bg-menu);

    .remove-endpoint-button {
      margin-left: 0.3rem;
      display: inline;
      padding: 0.3rem;
      height: 100%;

      svg {
        fill: var(--color-error);
        padding: 0.3rem !important;
        margin: -0.3rem !important;
      }
    }
  }
`);
