/* eslint-disable header/header */

import type { DeriveCustom } from '@polkadot/types/types';

import * as stakingOriginal from '@polkadot/api-derive/staking';

import * as stakingOverride from './staking';
import * as xxCustody from './xxCustody';

const derive: DeriveCustom = {
  staking: {
    ...stakingOriginal,
    ...stakingOverride
  },
  xxCustody
};

export default derive;
