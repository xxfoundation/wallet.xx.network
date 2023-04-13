/* eslint-disable header/header */
import React, { FC, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { LinkOption } from '@polkadot/apps-config/settings/types';
import { Button, Icon, Input } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import SideMenuItem from './SideMenuItem';

function isValidUrl (url: string): boolean {
  return (
    // some random length... we probably want to parse via some lib
    (url.length >= 7) &&
    // check that it starts with a valid ws identifier
    (url.startsWith('ws://') || url.startsWith('wss://'))
  );
}

interface Props {
  className?: string;
  endpoints: LinkOption[];
  addEndpoint: (endpoint: string) => void;
}

const AddCustomEndpoint: FC<Props> = ({ addEndpoint, className, endpoints }) => {
  const { t } = useTranslation();
  const [customUrl, setCustomUrl] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [touched, setTouched] = useState(false);

  const open = useCallback(() => setExpanded(true), [setExpanded]);
  const close = useCallback(() => setExpanded(false), [setExpanded]);

  const isKnownUrl = useMemo(() => {
    let result = false;

    endpoints.some((endpoint) => {
      if (customUrl && endpoint.value === customUrl) {
        result = true;

        return true;
      }

      return false;
    });

    return result;
  }, [customUrl, endpoints]);

  const _addEndpoint = useCallback(
    () => addEndpoint(customUrl),
    [customUrl, addEndpoint]
  );

  const _setCustomUrl = useCallback(
    (url: string) => {
      setTouched(true);
      setCustomUrl(url);
    },
    [setTouched, setCustomUrl]
  );

  return (<div
    className={`${className ?? ''} ${expanded ? 'expanded' : ''}`}
    onMouseEnter={open}
    onMouseLeave={close}>
    <SideMenuItem
      className={`${expanded ? 'selected' : ''} highlight--color-contrast`}
      onClick={open}>
      <Icon
        className='endpoint-icon'
        icon='plus' />
      <label className='endpoint-label'>
        {t<string>('Add Custom Endpoint')}
      </label>
    </SideMenuItem>
    <div className='add-endpoint-input-container'>
      <Input
        className='add-endpoint-input'
        isError={touched && (!isValidUrl(customUrl) || isKnownUrl)}
        isFull
        label={t<string>('custom endpoint')}
        onChange={_setCustomUrl}
        value={customUrl}
      />
      <Button
        className='add-endpoint-button'
        icon='save'
        isDisabled={!isValidUrl(customUrl) || isKnownUrl}
        onClick={_addEndpoint}
      />
    </div>
  </div>);
};

export default React.memo(styled(AddCustomEndpoint)`
  position: relative;

  .add-endpoint-input-container {
    display: none;
    position: absolute;
    left: 100%;
    top: 0;
    min-width: 16rem;

    .add-endpoint-input input {
      border-radius: 0;
      padding-right: 4rem;
    }

    .add-endpoint-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
  }

  &.expanded .add-endpoint-input-container {
    display: block;
  }
`);
