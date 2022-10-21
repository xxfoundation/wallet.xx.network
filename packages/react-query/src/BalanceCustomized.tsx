// Copyright 2017-2022 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import FormatBalance from './FormatBalance';
import { BN, BN_ZERO } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  balance?: BN | null;
}

function BalanceCustomized({ children, className = '', label, balance }: Props): React.ReactElement<Props> {
  return (
    <FormatBalance
      className={className}
      label={label}
      value={balance || BN_ZERO}
    >
      {children}
    </FormatBalance>
  );
}

export default React.memo(BalanceCustomized);
