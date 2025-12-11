// Copyright 2017-2023 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useTotalStakeableIssuance } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function TotalStakeableIssuance ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const totalStakeableIssuance = useTotalStakeableIssuance();

  return (
    <div className={className}>
      {label || ''}
      <FormatBalance
        value={totalStakeableIssuance}
        withSi
      />
      {children}
    </div>
  );
}

export default React.memo(TotalStakeableIssuance);
