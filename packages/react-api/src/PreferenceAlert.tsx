// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';

import { Button, Icon } from '@polkadot/react-components';

import { useTranslation } from './translate';
import { InjectionPreference } from './types';
import { ApiContext } from '.';

interface Props {
  children: React.ReactNode;
  className?: string;
  onSelect: (pref: InjectionPreference) => void
}

function PreferenceAlert ({ className = '' }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { setInjectionPreference } = useContext(ApiContext);

  const preferenceSelector = useCallback((pref: InjectionPreference) => () => {
    setInjectionPreference(pref);
  }, [setInjectionPreference]);

  return (
    <div className={`${className} isInfo`}>
      <div className='content'>
        <Icon
          className='contentIcon'
          icon='warning'
          size='2x'
        />
        <div className='contentItem'>
          {t<string>('We noticed you are using a wallet extension. Would you like to automatically inject your accounts?')}
        </div>
        <div className='contentOptions'>
          <Button
            icon='times'
            label={t<string>('Not now')}
            onClick={preferenceSelector(InjectionPreference.NotNow)}
          />
          <Button
            icon='check'
            label={t<string>('Inject')}
            onClick={preferenceSelector(InjectionPreference.Inject)}
          />
        </div>
      </div>
    </div>
  );
}

export default React.memo(styled(PreferenceAlert)`
  background: var(--bg-menu);
  border: 1px solid transparent;
  border-radius: 0.25rem;
  border-left-width: 0.25rem;
  line-height: 1.5em;
  padding: 0 1rem;
  position: fixed;
  right: 0.75rem;
  top: 0.75rem;
  max-width: 55rem;
  z-index: 500;

  &:before {
    border-radius: 0.25rem;
    bottom: 0;
    content: ' ';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: -1;
  }

  &.isError {
    &:before {
      background: rgba(255, 12, 12, 0.05);
    }

    border-color: rgba(255, 12, 12, 1);
  }

  &.isInfo {
    &:before {
      background: rgba(255, 196, 12, 0.05);
    }

    border-color: rgba(255, 196, 12, 1);
  }

  .content {
    display: flex;
    margin: 0 auto;
    max-width: 50rem;
    padding: 1em 3rem 1rem 0.5rem;
    position: relative;

    .contentIcon {
      flex: 0;
    }

    .contentItem {
      flex: 1;
      padding: 0 1rem;

      > div+div {
        margin-top: 0.5rem;
      }
    }
  }

  .closeIcon {
    cursor: pointer;
    position: absolute;
    right: 0em;
    top: 0.75rem;
  }
`);
