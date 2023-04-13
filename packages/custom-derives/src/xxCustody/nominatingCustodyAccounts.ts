/* eslint-disable header/header */
// Copyright 2017-2021 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveApi } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { Nominations } from '@polkadot/types/interfaces';
import type { DeriveCustodyAccounts } from '../types';

import { map, switchMap } from 'rxjs';

import { memo } from '@polkadot/api-derive/util';

export function nominatingCustodyAccounts (instanceId: string, api: DeriveApi) {
  return memo(
    instanceId,
    () => api.query.xxCustody.custodyAccounts.keys().pipe(
      map(
        (keys) => keys.map(({ args: [nominatorId] }) => nominatorId)),
      switchMap((custodyAccounts) => api.query.staking.nominators.multi<Option<Nominations>>(custodyAccounts).pipe(
        map(
          (nominators: Option<Nominations>[]) => nominators.reduce((acc, nominators, index) => {
            if (nominators.isSome && custodyAccounts[index]) {
              return acc.concat({
                accountId: custodyAccounts[index]?.toString(),
                targets: nominators.unwrap().targets
              });
            }

            return acc;
          }, [] as DeriveCustodyAccounts)
        )
      )
      )
    )
  );
}
