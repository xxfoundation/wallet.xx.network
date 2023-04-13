// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Balance } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  balance?: Balance;
  voters?: AccountId[];
}

function Voters ({ balance, voters }: Props): React.ReactElement<Props> {
  const summary = useMemo(
    () => balance
      ? <FormatBalance value={balance} />
      : formatNumber(voters?.length),
    [balance, voters]
  );

  if (!voters || !voters.length) {
    return <><td className='all number' /><td className='number'>0</td></>;
  }

  return (
    <>
      <td
        className='all expand'
        colSpan={balance ? 1 : 2}
      >
        <Expander summary={summary}>
          {voters.map((who): React.ReactNode =>
            <AddressMini
              key={who.toString()}
              value={who}
              withLockedVote
            />
          )}
        </Expander>
      </td>
      {balance && (
        <td className='number'>
          {formatNumber(voters?.length || 0)}
        </td>
      )}
    </>
  );
}

export default React.memo(Voters);
