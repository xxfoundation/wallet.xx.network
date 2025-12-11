// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { NominatorStake } from './types';

import React, { useMemo } from 'react';

import { AddressMini, AnimatedEllipsis, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  nominations?: NominatorStake[];
  total?: BN;
}

function NominationStake ({ nominations, total }: Props): React.ReactElement<Props> {
  const renderNominees = useMemo(
    () => () => nominations?.map(({ nominee, value }) => (
      <AddressMini
        bonded={value}
        key={nominee}
        value={nominee}
        withBonded
      />
    )),
    [nominations]
  );

  return (
    <td className='expand all'>
      {total
        ? (
          <Expander
            renderChildren={renderNominees}
            summary={
              <FormatBalance
                labelPost={` (${nominations?.length ?? 0})`}
                value={total}
              />
            }
          />
        )
        : (
          <AnimatedEllipsis />
        )}
    </td>
  );
}

export default React.memo(NominationStake);
