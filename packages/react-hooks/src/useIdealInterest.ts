// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Compact, Struct, Vec } from '@polkadot/types';
import type { BlockNumber } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { Perbill } from '@polkadot/types/interfaces/runtime';

import { useApi, useCall } from '.';

// TODO remove this and use the real type XxEconomicsInflationIdealInterestPoint
interface IdealInterestPoint extends Struct {
  readonly block: BlockNumber;
  readonly interest: Compact<Perbill>;
}

export function useIdealInterest (): BN | undefined {
  const { api } = useApi();
  const interestPoints = useCall<Vec<IdealInterestPoint>>(api.query.xxEconomics.interestPoints);
  const blockNumber = useCall<BlockNumber>(api.query.system.number);

  const idealInterest = useMemo(() => {
    if (interestPoints && blockNumber) {
      let currentBlockInterestPointIndex: number | undefined;

      for (let i = 0; i < interestPoints.length - 1; i++) {
        if (blockNumber.gte(interestPoints[i].block) && blockNumber.lt(interestPoints[i + 1].block)) {
          currentBlockInterestPointIndex = i;
          break;
        }
      }

      // Current block number is greater than the last indexed interest point block number
      if (currentBlockInterestPointIndex === undefined) {
        return interestPoints[interestPoints.length - 1].interest.toBn();
      }

      const interestInterval = interestPoints[currentBlockInterestPointIndex + 1].interest.toBn()
        .sub(interestPoints[currentBlockInterestPointIndex].interest.toBn());
      const blockInterval = interestPoints[currentBlockInterestPointIndex + 1].block.clone()
        .sub(interestPoints[currentBlockInterestPointIndex].block);

      const blockDiff = blockNumber.clone().sub(interestPoints[currentBlockInterestPointIndex].block);

      const idealInterest = interestInterval
        .clone()
        .mul(blockDiff)
        .div(blockInterval)
        .add(interestPoints[currentBlockInterestPointIndex].interest.toBn());

      return idealInterest;
    }

    return undefined;
  }, [interestPoints, blockNumber]);

  return idealInterest;
}
