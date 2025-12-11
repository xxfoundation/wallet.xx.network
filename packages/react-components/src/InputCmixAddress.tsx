// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '@polkadot/app-sudo/translate';

import Input from './Input';
import Toggle from './Toggle';

type Props = {
  className: string;
  cmixId: string | null;
  isError: boolean;
  onChange: (cmixId: string) => void
  enabled?: boolean;
  onEnabledChanged?: (enabled: boolean) => void;
  includeToggle?: boolean;
}

const InputCmixAddress: React.FC<Props> = ({ className, cmixId, enabled, includeToggle = true, isError, onChange, onEnabledChanged }) => {
  const { t } = useTranslation();

  return (
    <Input
      className={className}
      help={t<string>('The cMix ID is a 256 bit hash identifier, represented by a hex string of 0x + 64 characters.')}
      isDisabled={enabled === false}
      isError={isError}
      label={t<string>('cMix ID')}
      onChange={onChange}
      placeholder='0x...'
      value={cmixId || ''}
    >
      {includeToggle && (
        <Toggle
          isOverlay
          label={t<string>('include option')}
          onChange={onEnabledChanged}
          value={enabled}
        />
      )}
    </Input>
  );
};

export default React.memo(styled(InputCmixAddress)`
  .ui--Toggle {
    right: 2.25rem;
  }

  .ui.input input {
    padding-right: 13rem;
  }
`);
