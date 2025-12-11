// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCustom } from '@polkadot/types/types';

import * as stakingOriginal from '@polkadot/api-derive/staking';

import * as stakingOverride from './staking/index.js';
import * as xxCustody from './xxCustody/index.js';

const derive: DeriveCustom = {
  staking: {
    ...stakingOriginal,
    ...stakingOverride
  },
  xxCustody
};

export default derive;
