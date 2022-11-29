// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveSessionProgress, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { Option, StorageKey } from '@polkadot/types';
import type { AccountId32 } from '@polkadot/types/interfaces';
import type { PalletStakingStakingLedger, PalletStakingUnappliedSlash, PalletStakingValidatorPrefs } from '@polkadot/types/lookup';
import type { SortedTargets } from '../../types';
import type { Slash } from '../types';

import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { AddressInfo, AddressMini, AddressSmall, Badge, Button, Menu, Popup, StakingBonded, StakingRedeemable, StakingUnbonding, StatusContext, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { BN, formatNumber, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import useSlashingSpans from '../useSlashingSpans';
import BondExtra from './BondExtra';
import InjectKeys from './InjectKeys';
import KickNominees from './KickNominees';
import ListNominees from './ListNominees';
import Nominate from './Nominate';
import Rebond from './Rebond';
import SetCmixId from './SetCmixId';
import SetControllerAccount from './SetControllerAccount';
import SetSessionKey from './SetSessionKey';
import TransferCmixId from './TransferCmixId';
import Unbond from './Unbond';
import Validate from './Validate';
import WarnBond from './WarnBond';

const ELECTION_FACTOR = 1.5;

interface Props {
  allSlashes?: [BN, PalletStakingUnappliedSlash[]][];
  className?: string;
  isDisabled?: boolean;
  info: StakerState;
  minCommission?: BN;
  next?: string[];
  stashId: string;
  targets: SortedTargets;
  validators?: string[];
}

function extractSlashes (stashId: string, allSlashes: [BN, PalletStakingUnappliedSlash[]][] = []): Slash[] {
  return allSlashes
    .map(([era, all]) => ({
      era,
      slashes: all.filter(({ others, validator }) =>
        validator.eq(stashId) || others.some(([nominatorId]) => nominatorId.eq(stashId))
      )
    }))
    .filter(({ slashes }) => slashes.length);
}

function useStashCalls (api: ApiPromise, stashId: string) {
  const params = useMemo(() => [stashId], [stashId]);
  const balancesAll = useCall<DeriveBalancesAll>(api.derive.balances?.all, params);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account, params);
  const stakingValidators = useCall<[StorageKey, PalletStakingValidatorPrefs][]>(api.query.staking.validators.entries);
  const activeValidators = useCall<string[]>(api.query.session.validators);
  const stakingLedgers = useCall<[StorageKey, Option<PalletStakingStakingLedger>][]>(api.query.staking.ledger.entries);
  const bonded = useCall<[StorageKey, Option<AccountId32>][]>(api.query.staking.bonded.entries);
  const spanCount = useSlashingSpans(stashId);

  return { activeValidators, balancesAll, bonded, spanCount, stakingAccount, stakingLedgers, stakingValidators };
}

function useControllerCalls (api: ApiPromise, controllerId: string | null) {
  const params = useMemo(() => [controllerId], [controllerId]);
  const stakingLedger = useCall<Option<PalletStakingStakingLedger>>(api.query.staking.ledger, params);

  return stakingLedger?.unwrapOr(undefined);
}

function Account ({ allSlashes, className = '', info: { controllerId, destination, hexSessionIdNext, hexSessionIdQueue, isLoading, isOwnController, isOwnStash, isStashNominating, isStashValidating, nominating, sessionIds, stakingLedger, stashId }, isDisabled, minCommission, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { queueExtrinsic } = useContext(StatusContext);
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isInjectOpen, toggleInject] = useToggle();
  const [isKickOpen, toggleKick] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isRebondOpen, toggleRebond] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSetSessionOpen, toggleSetSession] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  const [isValidateOpen, toggleValidate] = useToggle();
  const [isSetCmixIdOpen, toggleSetCmixId] = useToggle();
  const [isTransferCmixIdOpen, toggleTransferCmixId] = useToggle();
  const { activeValidators, balancesAll, bonded, spanCount, stakingAccount, stakingLedgers, stakingValidators } = useStashCalls(api, stashId);
  const totalUnlocking = stakingAccount && (stakingAccount.unlocking || []).reduce((acc, { value }) => acc.iadd(value), new BN(0));

  const ledger = useControllerCalls(api, controllerId);
  const ledgers = useMemo(() => stakingLedgers?.map((elem) => {
    return elem[1].unwrap();
  }) || [], [stakingLedgers]);
  const cmixId = ledger?.cmixId.isSome ? ledger?.cmixId.unwrap().toString() : undefined;

  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session?.progress);
  const lastEraSession = sessionInfo ? sessionInfo.eraLength.toNumber() - sessionInfo.sessionLength.toNumber() * 2 : 0;
  const electionCutoffLength = sessionInfo ? sessionInfo.eraLength.toNumber() - sessionInfo.sessionLength.toNumber() * ELECTION_FACTOR : 0;
  const transferWindow = sessionInfo && (sessionInfo?.eraProgress.toNumber() < electionCutoffLength || sessionInfo?.eraProgress.toNumber() > lastEraSession);

  const stakingValAddresses = stakingValidators?.filter(([key]) => key.args.length).map(([key]) => key.args[0].toString()) || [];
  const bondedAddresses = bonded?.filter(([key]) => key.args.length).map(([key]) => key.args[0].toString()) || [];

  const validToTransferCmixId = cmixId && activeValidators && stashId && !activeValidators.some((element) => element === stashId) && !stakingValAddresses?.some((elem) => elem === stashId) && transferWindow;

  const slashes = useMemo(
    () => extractSlashes(stashId, allSlashes),
    [allSlashes, stashId]
  );

  const withdrawFunds = useCallback(
    () => queueExtrinsic({
      accountId: controllerId,
      extrinsic: api.tx.staking.withdrawUnbonded.meta.args.length === 1
        ? api.tx.staking.withdrawUnbonded(spanCount)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore (We are doing toHex here since we have a Vec<u8> input)
        : api.tx.staking.withdrawUnbonded()
    }),
    [api, controllerId, queueExtrinsic, spanCount]
  );

  const hasBonded = !!stakingAccount?.stakingLedger && !stakingAccount.stakingLedger.active?.isEmpty;

  return (
    <tr className={className}>
      <td className='badge together'>
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
      <td className='address'>
        <AddressSmall value={stashId} />
        {isBondExtraOpen && (
          <BondExtra
            controllerId={controllerId}
            onClose={toggleBondExtra}
            stakingInfo={stakingAccount}
            stashId={stashId}
          />
        )}
        {isInjectOpen && (
          <InjectKeys onClose={toggleInject} />
        )}
        {isKickOpen && controllerId && (
          <KickNominees
            controllerId={controllerId}
            onClose={toggleKick}
            stashId={stashId}
          />
        )}
        {isNominateOpen && controllerId && (
          <Nominate
            controllerId={controllerId}
            nominating={nominating}
            onClose={toggleNominate}
            stashId={stashId}
            targets={targets}
          />
        )}
        {isRebondOpen && (
          <Rebond
            controllerId={controllerId}
            onClose={toggleRebond}
            stakingInfo={stakingAccount}
            stashId={stashId}
          />
        )}
        {isSetControllerOpen && controllerId && (
          <SetControllerAccount
            defaultControllerId={controllerId}
            onClose={toggleSetController}
            stashId={stashId}
          />
        )}
        {isSetSessionOpen && controllerId && (
          <SetSessionKey
            controllerId={controllerId}
            onClose={toggleSetSession}
            stashId={stashId}
          />
        )}
        {isUnbondOpen && (
          <Unbond
            controllerId={controllerId}
            onClose={toggleUnbond}
            stakingLedger={stakingLedger}
            stashId={stashId}
          />
        )}
        {isValidateOpen && controllerId && (
          <Validate
            controllerId={controllerId}
            minCommission={minCommission}
            onClose={toggleValidate}
            stashId={stashId}
          />
        )}
        {isSetCmixIdOpen && (
          <SetCmixId
            controllerId={controllerId || stashId}
            onClose={toggleSetCmixId}
            stashId={stashId}
          />
        )}
        {isTransferCmixIdOpen && cmixId && (
          <TransferCmixId
            cmixId={cmixId}
            ledgers={ledgers}
            onClose={toggleTransferCmixId}
            stashId={stashId}
            stashes={bondedAddresses}
          />
        )}
      </td>
      <td className='address'>
        <AddressMini value={controllerId} />
      </td>
      <td className='start media--1200'>
        {destination?.isAccount
          ? <AddressMini value={destination.asAccount} />
          : destination?.toString()
        }
      </td>
      <td className='number'>
        <StakingBonded stakingInfo={stakingAccount} />
        <StakingUnbonding stakingInfo={stakingAccount} />
        <StakingRedeemable stakingInfo={stakingAccount} />
      </td>
      {isStashValidating
        ? (
          <td className='all'>
            <AddressInfo
              address={stashId}
              withBalance={false}
              withHexSessionId={hexSessionIdNext !== '0x' && [hexSessionIdQueue, hexSessionIdNext]}
              withValidatorPrefs
            />
            <WarnBond
              minBond={targets.minValidatorBond}
              stakingInfo={stakingAccount}
            />
          </td>
        )
        : (
          <td className='all expand'>
            {isStashNominating && (
              <>
                <ListNominees
                  nominating={nominating}
                  stashId={stashId}
                />
                <WarnBond
                  minBond={targets.minNominatorBond}
                  stakingInfo={stakingAccount}
                />
              </>
            )}
          </td>
        )
      }
      <td className='button'>
        {!isLoading && (
          <>
            {(isStashNominating || isStashValidating)
              ? (
                <TxButton
                  accountId={controllerId}
                  icon='stop'
                  isDisabled={!isOwnController || isDisabled}
                  key='stop'
                  label={t<string>('Stop')}
                  tx={api.tx.staking.chill}
                />
              )
              : (
                <Button.Group>
                  {(!sessionIds.length || hexSessionIdNext === '0x')
                    ? (
                      <Button
                        icon='sign-in-alt'
                        isDisabled={!isOwnController || isDisabled}
                        key='set'
                        label={t<string>('Session Key')}
                        onClick={toggleSetSession}
                      />
                    )
                    : (
                      <Button
                        icon='certificate'
                        isDisabled={!isOwnController || isDisabled || !hasBonded}
                        key='validate'
                        label={t<string>('Validate')}
                        onClick={toggleValidate}
                      />
                    )
                  }
                  <Button
                    icon='hand-paper'
                    isDisabled={!isOwnController || isDisabled || !hasBonded}
                    key='nominate'
                    label={t<string>('Nominate')}
                    onClick={toggleNominate}
                  />
                </Button.Group>
              )
            }
            <Popup
              isDisabled={isDisabled}
              key='settings'
              value={
                <Menu>
                  <Menu.Item
                    isDisabled={!isOwnStash || !balancesAll?.freeBalance.gtn(0)}
                    label={t<string>('Bond more funds')}
                    onClick={toggleBondExtra}
                  />
                  <Menu.Item
                    isDisabled={!isOwnController || !stakingAccount || !stakingAccount.stakingLedger || stakingAccount.stakingLedger.active?.isEmpty}
                    label={t<string>('Unbond funds')}
                    onClick={toggleUnbond}
                  />
                  <Menu.Item
                    isDisabled={!isOwnController || !stakingAccount || !totalUnlocking || !totalUnlocking.gtn(0)}
                    onClick={toggleRebond}
                  >
                    {t<string>('Rebond unlocked funds')}
                  </Menu.Item>
                  <Menu.Item
                    isDisabled={!isOwnController || !stakingAccount || !stakingAccount.redeemable || !stakingAccount.redeemable.gtn(0)}
                    label={t<string>('Withdraw unbonded funds')}
                    onClick={withdrawFunds}
                  />
                  <Menu.Divider />
                  <Menu.Item
                    isDisabled={!isOwnStash}
                    label={t<string>('Change controller account')}
                    onClick={toggleSetController}
                  />
                  {isStashValidating && (
                    <>
                      <Menu.Item
                        isDisabled={!isOwnController}
                        label={t<string>('Change validator preferences')}
                        onClick={toggleValidate}
                      />
                      {isFunction(api.tx.staking.kick) && (
                        <Menu.Item
                          isDisabled={!isOwnController}
                          label={t<string>('Remove nominees')}
                          onClick={toggleKick}
                        />
                      )}
                    </>
                  )}
                  <Menu.Divider />
                  {!isStashNominating && (
                    <Menu.Item
                      isDisabled={!isOwnController}
                      label={t<string>('Change session keys')}
                      onClick={toggleSetSession}
                    />
                  )}
                  {isStashNominating && (
                    <Menu.Item
                      isDisabled={!isOwnController || !targets.validators?.length}
                      onClick={toggleNominate}
                    >
                      {t<string>('Set nominees')}
                    </Menu.Item>
                  )}
                  {!isStashNominating && (
                    <Menu.Item onClick={toggleInject}>
                      {t<string>('Inject session keys (advanced)')}
                    </Menu.Item>
                  )}
                  <Menu.Divider />
                  {
                    <Menu.Item
                      isDisabled={!!cmixId}
                      onClick={toggleSetCmixId}
                    >
                      {t<string>('Set Cmix ID')}
                    </Menu.Item>
                  }
                  {
                    <Menu.Item
                      isDisabled={!validToTransferCmixId}
                      onClick={toggleTransferCmixId}
                    >
                      {t<string>('Transfer Cmix ID')}
                    </Menu.Item>
                  }
                </Menu>
              }
            />
          </>
        )}
      </td>
    </tr>
  );
}

export default React.memo(styled(Account)`
  .ui--Button-Group {
    display: inline-block;
    margin-right: 0.25rem;
    vertical-align: inherit;
  }

  .hidden {
    display: none;
  }
`);
