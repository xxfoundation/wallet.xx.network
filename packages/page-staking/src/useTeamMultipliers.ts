/* eslint-disable header/header */

import type { Option } from '@polkadot/types';
import type { AccountId, StakingLedger } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';

import { DeriveCustodyAccounts } from '@xxnetwork/custom-derives/types';
import { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_ZERO } from '@polkadot/util';

export type TeamMultipliers = Record<string, BN>;

const extractTeamNominationsInfo = (custodyAccounts: DeriveCustodyAccounts, ledgers: (StakingLedger | null)[]) => {
  const nominees: Record<string, BN> = {};

  custodyAccounts.forEach((custodyAccount, index) => {
    const ledger = ledgers[index];
    const key = custodyAccount.targets[0]?.toString();

    if (key && ledger) {
      const current = nominees[key] || BN_ZERO;

      nominees[key] = current.add(new BN(ledger.active.unwrap()));
    }
  });

  return nominees;
};

const useTeamMultipliers = () => {
  const { api } = useApi();
  const mapOptionals = <T extends Codec> (array: Option<T>[] | undefined) => array && array.map((item) => (item && item.isSome) ? item.unwrap() : null);
  const custodyAccounts = useCall<DeriveCustodyAccounts>(api.derive.xxCustody.nominatingCustodyAccounts);
  const custodyAccountIds = custodyAccounts && custodyAccounts.map(({ accountId }) => accountId);
  const custodyAccountControllers = useCall<Option<AccountId>[]>(custodyAccountIds && api.query.staking.bonded.multi, [custodyAccountIds]);
  const controllerIds = mapOptionals(custodyAccountControllers);
  const custodyAccountLedgerOptionals = useCall<Option<StakingLedger>[]>(controllerIds && api.query.staking.ledger.multi, [controllerIds]);
  const ledgers = mapOptionals(custodyAccountLedgerOptionals);

  const extracted = useMemo(
    () => custodyAccounts && ledgers
      ? extractTeamNominationsInfo(custodyAccounts, ledgers)
      : undefined,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [custodyAccounts?.join(''), JSON.stringify(ledgers)]
  );

  return extracted;
};

export default useTeamMultipliers;
