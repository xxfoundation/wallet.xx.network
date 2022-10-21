/* eslint-disable header/header */
import type { ApiPromise } from '@polkadot/api';
import type { Compact } from '@polkadot/types';
import type { Perbill } from '@polkadot/types/interfaces/runtime';

// TODO import the real type
// import { InflationFixedParams } from '@xxnetwork/custom-types';
import { getInflationParams } from '@polkadot/apps-config';
import { useCall } from '@polkadot/react-hooks';

interface InflationFixedParams {
  minInflation: Compact<Perbill>;
  idealStake: Compact<Perbill>;
  falloff: Compact<Perbill>;
}

export interface InflationParams {
  falloff: number;
  minInflation: number;
  idealStake: number;
}

const toNumber = (x: Compact<Perbill>) => x.toNumber() / 1e9;

const transform = (params: InflationFixedParams): InflationParams => ({
  falloff: toNumber(params.falloff),
  idealStake: toNumber(params.idealStake),
  minInflation: toNumber(params.minInflation)
});

export function useInflationParams (api: ApiPromise): InflationParams {
  const inflationParams = useCall<InflationParams>(api.query.xxEconomics.inflationParams, undefined, { transform });
  const defaults = getInflationParams(api);

  return { idealStake: 0, ...defaults, ...inflationParams };
}
