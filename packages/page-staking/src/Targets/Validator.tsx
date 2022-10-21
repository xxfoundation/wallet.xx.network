// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UnappliedSlash } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedBy, ValidatorInfo } from '../types';

import React, { useCallback, useContext, useMemo } from 'react';

import { AddressSmall, Badge, Checkbox, CmixAddress, Icon, Spinner } from '@polkadot/react-components';
import { checkVisibility } from '@polkadot/react-components/util';
import { useApi, useDeriveAccountInfo } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import MaxBadge from '../MaxBadge';
import { NodeLocationContext } from '../NodeLocationContext/context';
import Favorite from '../Overview/Address/Favorite';
import { useTranslation } from '../translate';
import HorizontalBarChart from './HorizontalBarChart';
import CommissionHover from './CommissionHover';

interface Props {
  allSlashes?: [BN, UnappliedSlash[]][];
  canSelect: boolean;
  filterName: string;
  info: ValidatorInfo;
  isNominated: boolean;
  isSelected: boolean;
  nominatedBy?: NominatedBy[];
  toggleFavorite: (accountId: string) => void;
  toggleSelected: (accountId: string) => void;
}

function queryAddress(address: string): void {
  window.location.hash = `/staking/query/${address}`;
}

function Validator({ allSlashes, canSelect, filterName, info, isNominated, isSelected, nominatedBy = [], toggleFavorite, toggleSelected }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  const locationContext = useContext(NodeLocationContext);
  const location = useMemo(() => {
    return (locationContext && locationContext.nodeLocations && info && info.cmixId)
      ? locationContext.nodeLocations[info.cmixId]
      : null;
  }, [locationContext, info]);
  const trimmedLocation =
    (location ?? '').split(',')
      .map((s) => s.trim())
      .filter((s) => !!s)
      .join(', ');

  const accountInfo = useDeriveAccountInfo(info.accountId);

  const isVisible = useMemo(
    () => accountInfo
      ? checkVisibility(api, info.key, accountInfo, filterName)
      : true,
    [accountInfo, api, filterName, info]
  );

  const slashes = useMemo(
    () => (allSlashes || [])
      .map(([era, all]) => ({ era, slashes: all.filter(({ validator }) => validator.eq(info.accountId)) }))
      .filter(({ slashes }) => slashes.length),
    [allSlashes, info]
  );

  const _onQueryStats = useCallback(
    () => queryAddress(info.key),
    [info.key]
  );

  const _toggleSelected = useCallback(
    () => toggleSelected(info.key),
    [info.key, toggleSelected]
  );

  const { accountId, bondOther, bondOwn, bondTotalWithTM, predictedStake, predictedElected, cmixId, isCommissionReducing, pastAvgCommission, commissionPer, isBlocking, isElected, isFavorite, key, nominatingAccounts, numNominators, rankOverall, stakedReturnCmp, teamMultiplier } = info;

  const barchartItems = useMemo(() => [{
    label: t<string>('Team Multipler'),
    value: teamMultiplier
  }, {
    label: t<string>('Own Stake'),
    value: bondOwn
  }, {
    label: t<string>('Other Stake'),
    value: bondOther
  }], [bondOwn, bondOther, teamMultiplier, t]);

  if (!isVisible) {
    return null;
  }

  return (
    <tr>
      <td className='badge together'>
        <Favorite
          address={key}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
        {isNominated || nominatingAccounts.length > 0
          ? (
            <Badge
              color={nominatingAccounts.length > 0 ? 'green' : 'orange'}
              icon='hand-paper'
            />
          )
          : <Badge color='transparent' />
        }
        {isElected
          ? (
            <Badge
              color='blue'
              icon='chevron-right'
            />
          )
          : <Badge color='transparent' />
        }
        <MaxBadge numNominators={numNominators || nominatedBy.length} />
        {isBlocking && (
          <Badge
            color='red'
            icon='user-slash'
          />
        )}
        {slashes.length !== 0 && (
          <Badge
            color='red'
            hover={t<string>('Slashed in era {{eras}}', {
              replace: {
                eras: slashes.map(({ era }) => formatNumber(era)).join(', ')
              }
            })}
            icon='skull-crossbones'
          />
        )}
      </td>
      <td className='number'>{formatNumber(rankOverall)}</td>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='middle media--1200 no-pad-right'>{numNominators}</td>
      <td className='middle media--1200 no-pad-left'>{nominatedBy.length}</td>
      <td>
        <CmixAddress
          nodeId={cmixId}
          shorten={true}
        />
      </td>
      <td>
        {trimmedLocation}
      </td>
      <td className='together' colSpan={1}>
        <CommissionHover isCommissionReducing={isCommissionReducing} commission={commissionPer} avgCommission={pastAvgCommission}/>
      </td>
      <td
        className='together'
        colSpan={3}
      >
        <HorizontalBarChart items={barchartItems} />
      </td>
      <td className='number together'>{!bondTotalWithTM.isZero() && <FormatBalance value={bondTotalWithTM} />}</td>
      <td className='number together' style={{color: predictedElected ? 'green' : 'red'}}>{predictedElected !== undefined ? <FormatBalance value={predictedStake}/> : <Spinner noLabel />}</td>
      <td className='number together'>{predictedElected !== undefined ? <>{stakedReturnCmp.toFixed(2)}%</> : <Spinner noLabel />}</td>
      <td className='middle'>
        {!isBlocking && (canSelect || isSelected) && (
          <Checkbox
            onChange={_toggleSelected}
            value={isSelected}
          />
        )}
      </td>
      <td className='middle'>
        <Icon
          className='staking--stats highlight--color'
          icon='chart-line'
          onClick={_onQueryStats}
        />
      </td>
    </tr>
  );
}

export default React.memo(Validator);
