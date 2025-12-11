// Copyright 2017-2023 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { DeriveApi } from '@polkadot/api-derive/types';
import type { EraIndex } from '@polkadot/types/interfaces';

import { combineLatest, map, of, switchMap } from 'rxjs';

import { memo } from '@polkadot/api-derive/util';

export interface DeriveOwnExposure {
  era: EraIndex;
  exposureMeta: any;
  exposurePaged: any;
}

/**
 * @description Retrieve own exposures (staking info) for a validator across all historical eras
 */
export function ownExposures (instanceId: string, api: DeriveApi): (accountId: Uint8Array | string, withActive?: boolean) => Observable<DeriveOwnExposure[]> {
  return memo(instanceId, (accountId: Uint8Array | string, withActive = false): Observable<DeriveOwnExposure[]> =>
    api.derive.staking.erasHistoric(withActive).pipe(
      switchMap((eras: EraIndex[]): Observable<DeriveOwnExposure[]> => {
        if (!eras || eras.length === 0) {
          return of([]);
        }

        // Check if the chain supports erasStakersPaged (newer) or just erasStakers (older)
        const hasPagedQuery = !!api.query.staking.erasStakersPaged;
        const hasMetaQuery = !!api.query.staking.erasStakersOverview;
        const hasErasStakers = !!api.query.staking.erasStakers;

        // Build the multi-query parameters
        const eraAccountPairs = eras.map((era) => [era, accountId]);

        return combineLatest([
          // Query erasStakersOverview (meta) if available, otherwise use null
          hasMetaQuery
            ? api.query.staking.erasStakersOverview.multi(eraAccountPairs)
            : of(eras.map(() => null)),
          // Query erasStakersPaged if available, otherwise use erasStakers
          hasPagedQuery
            ? api.query.staking.erasStakersPaged.multi(
                eras.map((era) => [era, accountId, 0]) // page 0
              )
            : hasErasStakers
            ? api.query.staking.erasStakers.multi(eraAccountPairs)
            : of(eras.map(() => null))
        ]).pipe(
          map(([metaData, pagedData]): DeriveOwnExposure[] => {
            return eras.map((era, index): DeriveOwnExposure => {
              const meta = metaData[index];
              const paged = pagedData[index];

              return {
                era,
                exposureMeta: meta,
                exposurePaged: paged
              };
            });
          })
        );
      })
    )
  );
}
