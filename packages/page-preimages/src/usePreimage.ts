// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { ApiPromise } from '@polkadot/api';
import type { Bytes, Option } from '@polkadot/types';
import type { Call, Hash } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { Preimage } from './types';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, isBn, isString } from '@polkadot/util';

function createResult (api: ApiPromise, optStatus: Option<any>, optBytes: Option<Bytes>, [proposalHash, proposalLength]: [HexString, BN]): Preimage {
  const status = optStatus.unwrapOr(null);
  const bytes = optBytes.unwrapOr(null);
  let count = 0;
  let proposal: Call | null = null;

  if (bytes) {
    try {
      proposal = api.registry.createType('Call', bytes.toU8a(true));
    } catch (error) {
      console.error(error);
    }
  }

  if (status && status.isRequested) {
    const req = status.asRequested;

    // the original version has asRequested as the actual count
    // (current/later versions has it as a structure)
    count = isBn(req)
      ? req.toNumber()
      : req.count.toNumber();
  }

  return {
    bytes,
    count,
    proposal,
    proposalHash,
    proposalLength,
    status
  };
}

function getParams (hash: Hash | HexString, optStatus: Option<any>): [HexString, BN] {
  const status = optStatus.unwrapOr(null);
  const hexHash = isString(hash)
    ? hash
    : hash.toHex();

  return status
    ? status.isRequested
      ? [hexHash, status.asRequested.len.unwrapOr(BN_ZERO)]
      : [hexHash, status.asUnrequested.len]
    : [hexHash, BN_ZERO];
}

export function getPreimageHash (hashOrBounded: Hash | HexString | any): HexString {
  if (isString(hashOrBounded)) {
    return hashOrBounded as `0x${string}`;
  }

  const bounded = hashOrBounded;

  return bounded.isInline
    ? bounded.asInline.hash.toHex()
    : bounded.isLegacy
      ? bounded.asLegacy.hash_.toHex()
      : bounded.isLookup
        ? bounded.asLookup.hash_.toHex()
        : hashOrBounded.toHex();
}

function usePreimageImpl (hashOrBounded?: Hash | HexString | any | null): Preimage | undefined {
  const { api } = useApi();

  const hash = useMemo(
    () => hashOrBounded && getPreimageHash(hashOrBounded),
    [hashOrBounded]
  );

  const optStatus = useCall<Option<any>>(hash && api.query.preimage.statusFor, [hash]);

  const params = useMemo(
    () => hash && optStatus && getParams(hash, optStatus),
    [hash, optStatus]
  );

  const optBytes = useCall<Option<Bytes>>(params && api.query.preimage.preimageFor, [params]);

  return useMemo(
    () => optBytes && optStatus && params
      ? createResult(api, optStatus, optBytes, params)
      : undefined,
    [api, optBytes, optStatus, params]
  );
}

export default createNamedHook('usePreimage', usePreimageImpl);
