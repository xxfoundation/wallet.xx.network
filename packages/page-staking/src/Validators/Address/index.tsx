// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeatAuthor } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { SlashingSpans, ValidatorPrefs } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedBy as NominatedByType, ValidatorInfo } from '../../types';
import type { NominatorValue } from './types';

import React, { useContext, useMemo } from 'react';

import { ApiPromise } from '@polkadot/api';
import { NodeLocationContext } from '@polkadot/app-staking/NodeLocationContext/context';
import { AddressSmall, Icon, LinkExternal } from '@polkadot/react-components';
import CmixAddress from '@polkadot/react-components/CmixAddress';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useCall, useDeriveAccountInfo } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import Favorite from './Favorite';
import NominatedBy from './NominatedBy';
import StakeOther from './StakeOther';
import Status from './Status';

interface Props {
  address: string;
  className?: string;
  filterName: string;
  hasQueries: boolean;
  isElected: boolean;
  isFavorite: boolean;
  isMain?: boolean;
  isPara?: boolean;
  lastBlock?: string;
  minCommission?: BN;
  nominatedBy?: NominatedByType[];
  points?: string;
  recentlyOnline?: DeriveHeartbeatAuthor;
  toggleFavorite: (accountId: string) => void;
  validatorInfo?: ValidatorInfo;
  withIdentity?: boolean;
}

interface StakingState {
  isChilled?: boolean;
  commission?: string;
  nominators: NominatorValue[];
  stakeTotal?: BN;
  stakeOther?: BN;
  stakeOwn?: BN;
  teamMultiplier?: BN;
  pastAvgCommission: number;
}

function expandInfo ({ exposure, pastAvgCommission, teamMultiplier, validatorPrefs }: ValidatorInfo, minCommission?: BN): StakingState {
  let nominators: NominatorValue[] = [];
  let stakeTotal: BN | undefined;
  let stakeOther: BN | undefined;
  let stakeOwn: BN | undefined;
  let multiplier: BN | undefined;

  if (exposure && exposure.total) {
    nominators = exposure.others.map(({ value, who }) => ({
      nominatorId: who.toString(),
      value: value.unwrap()
    }));
    stakeTotal = exposure.total?.unwrap() || BN_ZERO;
    stakeOwn = exposure.own.unwrap();
    stakeOther = stakeTotal.sub(stakeOwn);
    multiplier = exposure.custody ? exposure.custody.unwrap() : teamMultiplier;
  }

  const commission = (validatorPrefs as ValidatorPrefs)?.commission?.unwrap();

  return {
    commission: commission?.toHuman(),
    isChilled: commission && minCommission && commission.isZero() && commission.lt(minCommission),
    nominators,
    pastAvgCommission,
    stakeOther,
    stakeOwn,
    stakeTotal,
    teamMultiplier: multiplier
  };
}

const transformSlashes = {
  transform: (opt: Option<SlashingSpans>) => opt.unwrapOr(null)
};

function useAddressCalls (api: ApiPromise, address: string, isMain?: boolean) {
  const params = useMemo(() => [address], [address]);
  const accountInfo = useDeriveAccountInfo(address);
  const slashingSpans = useCall<SlashingSpans | null>(!isMain && api.query.staking.slashingSpans, params, transformSlashes);

  return { accountInfo, slashingSpans };
}

function Address ({ address, className = '', filterName, hasQueries, isElected, isFavorite, isMain, isPara, lastBlock, minCommission, nominatedBy, points, recentlyOnline, toggleFavorite, validatorInfo, withIdentity }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { accountInfo, slashingSpans } = useAddressCalls(api, address, isMain);

  const locationContext = useContext(NodeLocationContext);

  const location = useMemo(() => {
    return (locationContext && locationContext.nodeLocations && validatorInfo && validatorInfo.cmixId)
      ? locationContext.nodeLocations[validatorInfo.cmixId]
      : null;
  }, [locationContext, validatorInfo]);

  const { commission, isChilled, nominators, pastAvgCommission, stakeOther, stakeOwn, teamMultiplier } = useMemo(
    () => validatorInfo
      ? expandInfo(validatorInfo)
      : { nominators: [], pastAvgCommission: 0.0 },
    [validatorInfo]
  );

  const fixedCommission = validatorInfo?.commissionPer.toFixed(2);
  const commUse = isMain ? commission : `${fixedCommission ?? ''}%`;

  const isVisible = useMemo(
    () => accountInfo ? checkVisibility(api, address, accountInfo, filterName, withIdentity) : true,
    [api, accountInfo, address, filterName, withIdentity]
  );

  const statsLink = useMemo(
    () => `#/staking/query/${address}`,
    [address]
  );

  if (!isVisible) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='badge together'>
        <Favorite
          address={address}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        <Status
          isChilled={isChilled}
          isElected={isElected}
          isMain={isMain}
          isPara={isPara}
          isRelay={!!(api.query.parasShared || api.query.shared)?.activeValidatorIndices}
          nominators={isMain ? nominators : nominatedBy}
          onlineCount={recentlyOnline?.blockCount}
          onlineMessage={recentlyOnline?.hasMessage}
        />
      </td>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='number'>
        <CmixAddress
          nodeId={validatorInfo?.cmixId}
          shorten={true}
        />
      </td>
      <td>
        {location}
      </td>
      {isMain
        ? (
          <StakeOther
            nominators={nominators}
            stakeOther={stakeOther}
          />
        )
        : (
          <NominatedBy
            nominators={nominatedBy}
            slashingSpans={slashingSpans}
          />
        )
      }
      {isMain && (
        <>
          <td className='number media--1100'>
            {stakeOwn?.gtn(0) && (
              <FormatBalance value={stakeOwn} />
            )}
          </td>
          <td className='number media--1100'>
            {teamMultiplier?.gtn(0) && (
              <FormatBalance value={teamMultiplier} />
            )}
          </td>
        </>
      )}
      <td
        className='number'
        style={{ color: !isMain && validatorInfo?.isCommissionReducing ? 'red' : 'black' }}
      >
        {commUse}
      </td>
      {!isMain && (
        <td
          className='number'
          style={{ color: validatorInfo?.isCommissionReducing ? 'red' : 'black' }}
        >
          {pastAvgCommission.toFixed(2)}%
        </td>
      )}
      {isMain && (
        <>
          <td className='number'>
            {points}
          </td>
          <td className='number'>
            {lastBlock}
          </td>
        </>
      )}
      <td>
        {hasQueries && (
          <a href={statsLink}>
            <Icon
              className='highlight--color'
              icon='chart-line'
            />
          </a>
        )}
      </td>
      <td className='links media--1200'>
        <LinkExternal
          data={address}
          type={isMain ? 'validator' : 'intention'}
        />
      </td>
    </tr>
  );
}

export default React.memo(Address);
