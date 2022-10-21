// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IconName } from '@fortawesome/fontawesome-svg-core';

import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';

import StatusContext from './Status/Context';
import Button from './Button';
import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className?: string;
  icon?: IconName;
  label?: React.ReactNode;
  type?: string;
  isMnemonic?: boolean;
  value: string;
  onChangeSeed: (seed: string) => void;
}

function PasteButton({ onChangeSeed, children, className = '', icon = 'copy', label, type, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { queueAction } = useContext(StatusContext);

  const _onClick = useCallback(
    async (): Promise<void> => {
      const clipBoardText = await navigator.clipboard.readText()
      onChangeSeed(clipBoardText)
      queueAction && queueAction({
        action: t<string>('clipboard'),
        message: t<string>('{{type}} pasted', { replace: { type: type || t<string>('value') } }),
        status: 'queued'
      });
    },
    [onChangeSeed]
  );

  return (
    <div className={`ui--PasteButton ${className}`}>
      <div className='pasteContainer'>
        {children}
        <span className='pasteSpan'>
          <Button
            className='icon-button show-on-hover'
            icon={icon}
            isDisabled={!!value}
            label={label}
            onClick={_onClick}
          />
        </span>
      </div>
    </div>
  );
}

export default React.memo(styled(PasteButton)`
  .pasteSpan {
    white-space: nowrap;
    display: grid;
  }
`);
