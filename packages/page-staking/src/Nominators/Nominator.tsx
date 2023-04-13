/* eslint-disable header/header */
import type { Nominator } from './types';

import React, { useMemo } from 'react';

import { AddressSmall, AnimatedEllipsis } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useDeriveAccountInfo } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import NominationStakes from './NominationStakes';
import TargetList from './TargetList';

type Props = {
  className?: string;
  nameFilter?: string;
  nominator: Nominator;
}

function NominatorRow ({ className = '', nameFilter, nominator: { accountId, balance, nominations, stakes, totalStake } }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const accountInfo = useDeriveAccountInfo(accountId);

  const isVisible = useMemo(
    () => accountInfo
      ? checkVisibility(api, accountId, accountInfo, nameFilter)
      : true,
    [accountId, accountInfo, api, nameFilter]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className=''>
        {balance
          ? (
            <FormatBalance value={balance} />
          )
          : <AnimatedEllipsis />
        }
      </td>
      <NominationStakes
        nominations={stakes}
        total={totalStake}
      />
      <TargetList
        addresses={nominations?.targets.map((accId) => accId.toString())}
      />
      <td className='number together'>
        {nominations?.submittedIn?.toNumber() ?? <AnimatedEllipsis />}
      </td>
    </tr>
  );
}

export default React.memo(NominatorRow);
