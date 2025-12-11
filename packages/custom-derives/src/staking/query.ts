// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
// Copyright 2017-2023 @polkadot/api-derive authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { DeriveApi, DeriveStakingQuery, StakingQueryFlags } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { AccountId, EraIndex, Exposure, Nominations, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { H256 } from '@polkadot/types/interfaces/runtime';

import { combineLatest, map, of, switchMap } from 'rxjs';

import { memo } from '@polkadot/api-derive/util';

const toByteArray = (nodeId: H256) => Buffer.concat([nodeId.toU8a(true), new Uint8Array([2])]);
const toBase64 = (cmixId: Buffer) => cmixId.toString('base64');
const transformCmixAddress = (nodeId?: Option<H256>): string | undefined => (nodeId?.isSome && Number(nodeId) !== 0) ? toBase64(toByteArray(nodeId.unwrap())) : '';

function parseDetails (stashId: AccountId, controllerIdOpt: Option<AccountId> | null, nominatorsOpt: Option<Nominations>, validatorPrefs: ValidatorPrefs, exposure: Exposure, stakingLedgerOpt: Option<StakingLedger>): DeriveStakingQuery {
  return {
    accountId: stashId,
    cmixId: stakingLedgerOpt.isSome ? transformCmixAddress(stakingLedgerOpt.unwrap().cmixId) : undefined,
    controllerId: controllerIdOpt && controllerIdOpt.unwrapOr(null),
    exposure,
    exposureEraStakers: exposure,
    nominators: nominatorsOpt.isSome
      ? nominatorsOpt.unwrap().targets
      : [],
    rewardDestination: null,
    stakingLedger: stakingLedgerOpt.unwrapOrDefault(),
    stashId,
    validatorPrefs
  };
}

function getLedgers (api: DeriveApi, optIds: (Option<AccountId> | null)[], { withLedger = false }: StakingQueryFlags): Observable<Option<StakingLedger>[]> {
  const ids = optIds
    .filter((o): o is Option<AccountId> => withLedger && !!o && o.isSome)
    .map((o) => o.unwrap());
  const emptyLed = api.registry.createType<Option<StakingLedger>>('Option<StakingLedger>');

  return (
    ids.length
      ? api.query.staking.ledger.multi(ids)
      : of([])
  ).pipe(
    map((optLedgers): Option<StakingLedger>[] => {
      let offset = -1;

      return optIds.map((o): Option<StakingLedger> =>
        o && o.isSome
          ? optLedgers[++offset] || emptyLed
          : emptyLed
      );
    })
  );
}

function getStashInfo (api: DeriveApi, stashIds: AccountId[], activeEra: EraIndex, { withController, withExposure, withExposureErasStakersLegacy, withLedger, withNominations, withPrefs }: StakingQueryFlags): Observable<[(Option<AccountId> | null)[], Option<Nominations>[], null[], ValidatorPrefs[], Exposure[]]> {
  const emptyNoms = api.registry.createType<Option<Nominations>>('Option<Nominations>');
  const emptyExpo = api.registry.createType<Exposure>('Exposure');
  const emptyPrefs = api.registry.createType<ValidatorPrefs>('ValidatorPrefs');

  // Support both withExposure (legacy behavior) and withExposureErasStakersLegacy (new upstream flag)
  const shouldQueryExposure = withExposure || withExposureErasStakersLegacy;

  return combineLatest([
    withController || withLedger
      ? api.query.staking.bonded.multi(stashIds)
      : of(stashIds.map(() => null)),
    withNominations
      ? api.query.staking.nominators.multi(stashIds)
      : of(stashIds.map(() => emptyNoms)),
    of(stashIds.map(() => (null))), // always empty
    withPrefs
      ? api.query.staking.validators.multi(stashIds)
      : of(stashIds.map(() => emptyPrefs)),
    shouldQueryExposure
      ? api.query.staking.erasStakers.multi(stashIds.map((stashId) => [activeEra, stashId]))
      : of(stashIds.map(() => emptyExpo))
  ]);
}

function getBatch (api: DeriveApi, activeEra: EraIndex, stashIds: AccountId[], flags: StakingQueryFlags): Observable<DeriveStakingQuery[]> {
  return getStashInfo(api, stashIds, activeEra, flags).pipe(
    switchMap(([controllerIdOpt, nominatorsOpt, , validatorPrefs, exposure]): Observable<DeriveStakingQuery[]> =>
      getLedgers(api, controllerIdOpt, flags).pipe(
        map((stakingLedgerOpts) =>
          stashIds.map((stashId, index) =>
            parseDetails(stashId, controllerIdOpt[index], nominatorsOpt[index], validatorPrefs[index], exposure[index], stakingLedgerOpts[index])
          )
        )
      )
    )
  );
}

//
/**
 * @description From a stash, retrieve the controllerId and all relevant details
 */
export function query (instanceId: string, api: DeriveApi): (accountId: Uint8Array | string, flags: StakingQueryFlags) => Observable<DeriveStakingQuery> {
  return memo(instanceId, (accountId: Uint8Array | string, flags: StakingQueryFlags): Observable<DeriveStakingQuery> =>
    api.derive.staking.queryMulti([accountId], flags).pipe(
      map(([first]) => first)
    )
  );
}

export function queryMulti (instanceId: string, api: DeriveApi): (accountIds: (Uint8Array | string)[], flags: StakingQueryFlags) => Observable<DeriveStakingQuery[]> {
  return memo(instanceId, (accountIds: (Uint8Array | string)[], flags: StakingQueryFlags): Observable<DeriveStakingQuery[]> => {
    return accountIds.length
      ? api.derive.session.indexes().pipe(
        switchMap(({ activeEra }): Observable<DeriveStakingQuery[]> => {
          const stashIds = accountIds.map((accountId) => api.registry.createType('AccountId', accountId));

          return getBatch(api, activeEra, stashIds, flags);
        })
      )
      : of([]);
  });
}
