// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { AddressMini, AnimatedEllipsis, Expander } from '@polkadot/react-components';

interface Props {
  addresses?: string[];
}

function NominationList ({ addresses }: Props): React.ReactElement<Props> {
  const renderNominees = useMemo(
    () => () => addresses?.map((address) => (
      <AddressMini
        key={address}
        value={address}
      />
    )),
    [addresses]
  );

  return (
    <td className='expand all'>
      {(
        <Expander
          renderChildren={renderNominees}
          summary={
            addresses ? `${addresses.length}` : <AnimatedEllipsis />
          }
        />
      )}
    </td>
  );
}

export default React.memo(NominationList);
