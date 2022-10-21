// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import styled from 'styled-components';

import { Toggle } from '@polkadot/react-components';

interface Props {
  apiUrl: string;
  className?: string;
  label: React.ReactNode;
  setApiUrl: (apiUrl: string) => void;
  url: string;
}

function Url ({ apiUrl, className, label, setApiUrl, url }: Props): React.ReactElement<Props> {
  const _setApiUrl = useCallback(
    () => setApiUrl(url),
    [setApiUrl, url]
  );

  return (
    <Toggle
      className={`${className ?? ''} highlight--color-contrast`}
      isRadio
      label={label}
      onChange={_setApiUrl}
      title={url}
      value={apiUrl === url}
    />
  );
}

export default React.memo(styled(Url)`
  padding: 0.75rem 0;
  display: flex;
  align-items: center;
  text-align: left;

  label {
    color: var(--color-text);
    margin: 0;
    width: 10rem;
    white-space: break-spaces;
    word-wrap: break-word;
    overflow: hidden;
  }

  .ui--Toggle-Slider {
    min-width: 1.5rem;
    margin-left: 0.25rem;
  }
`);
