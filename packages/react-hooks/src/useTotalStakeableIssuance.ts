/* eslint-disable header/header */

// import type { AccountData } from '@polkadot/types/interfaces';
import type { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { useApi, useCall } from '.';

const unstakeableAccounts = [
  '6XmmXY7zLRirfHC8R99We24pEv2vpnGi29qZBRkdHNKxMCEB',
  '6XmmXY7zLRihLPUmtcKEtvKTxtphzwGRb7YUjztiEYBUG545'
];

export function useTotalStakeableIssuance (): BN | undefined {
  const { api } = useApi();
  const totalIssuance = useCall<BN>(api.query.balances?.totalIssuance);
  const totalCustody = useCall<BN>(api.query.xxCustody.totalCustody);
  const liquidityRewards = useCall<BN>(api.query.xxEconomics.liquidityRewards);
  const rewardsPoolAccount = api.consts.xxEconomics.rewardsPoolAccount;
  // Balances with unstakable amounts
  const balanceRPA = useCall<FrameSystemAccountInfo>(api.query.system.account, [rewardsPoolAccount]);
  const balanceTestnet = useCall<FrameSystemAccountInfo>(api.query.system.account, [unstakeableAccounts[0]]);
  const balanceSale = useCall<FrameSystemAccountInfo>(api.query.system.account, [unstakeableAccounts[1]]);

  const totalStakeableIssuance = useMemo<BN | undefined>(() => {
    if (totalIssuance && balanceRPA && balanceTestnet && balanceSale && totalCustody && liquidityRewards) {
      return totalIssuance.clone()
        .sub(balanceRPA.data.free).sub(balanceTestnet.data.free).sub(balanceSale.data.free)
        .sub(totalCustody)
        .sub(liquidityRewards);
    }

    return undefined;
  }, [totalIssuance, balanceRPA, balanceTestnet, balanceSale, totalCustody, liquidityRewards]);

  return totalStakeableIssuance;
}
