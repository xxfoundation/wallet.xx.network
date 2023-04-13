/* eslint-disable header/header */
import '@polkadot/api-derive';

import type { Observable } from 'rxjs';

import { DeriveCustodyAccounts } from './.';

declare module '@polkadot/api-derive/staking/types' {
  export interface DeriveStakingQuery {
    cmixId?: string;
    rewardDestination: null;
  }
}

declare module '@polkadot/api-derive/derive' {
  export interface ExactDerive {
    xxCustody: {
      nominatingCustodyAccounts: () => Observable<DeriveCustodyAccounts>
    };
  }
}
