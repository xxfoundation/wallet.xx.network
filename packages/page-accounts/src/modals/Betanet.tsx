// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ApiPromise } from '@polkadot/api';
import { InputAddress, MarkError, MarkWarning, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available, FormatBalance } from '@polkadot/react-query';
import { StorageKey } from '@polkadot/types';
import { BN } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
  accountId?: string;
}

interface Dictionary<T> {
  [Key: string]: T;
}

interface BetanetRewardsParams {
  [Key: string]: number[];
}

function formatString (option: string | undefined): string {
  return option ? option.replace(/"/g, '').toLowerCase() : '';
}

function optionResult (title: string, body: string, value: number | undefined, tokens: boolean) {
  return (
    <>
      {value !== undefined && tokens
        ? <div>
          <p style={{ marginBottom: '0.5em' }}><b>{title}</b></p>
          <FormatBalance
            className={'betanet'}
            value={new BN(value)}
          ></FormatBalance>
        </div>
        : <div>
          <p style={{ marginBottom: '0.5em' }}><b>{title}</b></p>
          <p style={{ marginBottom: '2em' }}>{value}{body}</p>
        </div>
      }
    </>
  );
}

function getAccountData (dict: Dictionary<string>[] | undefined, index: number, data: string): number | string | undefined {
  if (index > -1 && dict && dict[index]) {
    const aux = JSON.stringify(dict[index][data]);

    if (data === 'option') {
      return aux;
    }

    return aux && +aux || 0;
  }

  return undefined;
}

function calculate (rewardParams: BetanetRewardsParams, param: string, accountData: number | string | undefined, index: number): number | undefined {
  if (index > -1 && accountData !== undefined && rewardParams && rewardParams[param]) {
    if (typeof accountData === 'string') {
      return rewardParams[param][index];
    }

    return accountData * rewardParams[param][index];
  }

  return undefined;
}

async function enactmentBlockHasPassed (api: ApiPromise) {
  const enactmentBlock = api.consts.xxBetanetRewards.enactmentBlock;
  const lastBlock = await api.rpc.chain.getBlock();

  return lastBlock && lastBlock.block.header.number.toNumber() >= enactmentBlock.toNumber();
}

function Betanet ({ accountId: propSenderId, className = '', onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  // Setup ui dynamic variables
  const [accountId, setAccountId] = useState<string | null>(propSenderId || null);
  const [rewardOption, setRewardOption] = useState<string | null>(null);

  // Check if enacment block has passed. If so betanet reward options cannot be changed.
  const [enacted, setEnacted] = useState(false);

  useEffect(() => {
    enactmentBlockHasPassed(api)
      .then(setEnacted)
      .catch(() => {
        console.error('Error check enactment block');
      });
  }, [api]);

  // Define Hardcoded data to be displayed (options match on chain parameter)
  const value = {
    header: ['No Vesting', 'Vesting 1 Month', 'Vesting 3 Months', 'Vesting 6 Months', 'Vesting 9 Months'],
    options: ['novesting', 'vesting1month', 'vesting3month', 'vesting6month', 'vesting9month']
  };

  // Define Rewards Parameters for each option (matched by index)
  const rewardParams = {
    blocks: [0, 432000, 1296000, 2592000, 3888000],
    lock: [0, 1.00, 0.90, 0.80, 1.00],
    multiplier: [0.02, 0.12, 0.45, 1.00, 1.20]
  };

  // Export Betanet Rewards Accounts from chain
  const accounts = [] as string[];
  const data = useCall<StorageKey<any>[]>(api.query.xxBetanetRewards.accounts.keys);

  data && data.forEach(({ args: [accountId] }) => {
    accounts.push(JSON.stringify(accountId).replace(/"/g, ''));
  });
  const accountsInfo = useCall<Dictionary<string>[]>(api.query.xxBetanetRewards.accounts.multi, [accounts]);

  // TODO: Display betanet rewards tab on menu only if there is an betanet rewards account added to the web app
  // Check if selected account is valid
  const accountIndex = accountId ? accounts.indexOf(accountId) : -1;
  const valid = accountIndex > -1;

  // Get each info data from selected account
  const reward = getAccountData(accountsInfo, accountIndex, 'reward');
  const principal = getAccountData(accountsInfo, accountIndex, 'principal');
  const currRewardOption = formatString(getAccountData(accountsInfo, accountIndex, 'option') as string);

  // Calculate the outcome of submitting the selected Reward Option
  const selectedIndex = value.options.indexOf(rewardOption || currRewardOption);
  const potentialReward = calculate(rewardParams, 'multiplier', reward, selectedIndex);
  let lockedTokens = calculate(rewardParams, 'lock', principal, selectedIndex);

  if (lockedTokens !== undefined && potentialReward) {
    lockedTokens = lockedTokens + potentialReward;
  }

  const vestingBlocks = calculate(rewardParams, 'blocks', currRewardOption, selectedIndex);

  return (
    <div className={`${className}`}>
      <Modal
        className='app--accounts-Modal'
        header={t<string>('Select Betanet Rewards Option')}
        onClose={onClose}
        size='large'
      >
        {!enacted
          ? <Modal.Content>
            <div className={className}>
              <Modal.Columns hint={t<string>('')}>
                <InputAddress
                  defaultValue={propSenderId}
                  help={t<string>('The account holding the betanet tokens.')}
                  isDisabled={!!propSenderId}
                  label={t<string>('betanet account')}
                  labelExtra={
                    <Available
                      label={t<string>('balance')}
                      params={propSenderId || accountId}
                    />
                  }
                  onChange={setAccountId}
                  type='account'
                />
              </Modal.Columns>
            </div>
            {valid
              ? <>
                <div style={{ display: 'flex' }}>
                  <Modal.RadioGroup
                    OnChangeOption={setRewardOption}
                    defaultValue={currRewardOption}
                    title='Choose between the following Betanet Reward Options.'
                    value={value}
                  />
                  {reward && principal &&
                    <div style={{ margin: '1em 0 0 5em' }}>
                      {optionResult('Current Reward', '', +reward, true)}
                      {optionResult('Principal', '', +principal, true)}
                    </div>
                  }
                  {accountIndex > -1 &&
                    <div style={{ margin: '1em 0 0 5em' }}>
                      {optionResult('Multiplier', '%', rewardParams.multiplier[selectedIndex] * 100, false)}
                      {optionResult('Principal Lock', '%', rewardParams.lock[selectedIndex] * 100, false)}
                    </div>
                  }
                  {potentialReward &&
                    <div style={{ margin: '1em 0 0 5em' }}>
                      {optionResult('Potential Reward', '', potentialReward, true)}
                      {optionResult('Locked', '', lockedTokens, true)}
                      {optionResult('Vesting Period', ' blocks', vestingBlocks, false)}
                    </div>
                  }
                </div>
              </>
              : <MarkError content={t<string>('Account selected not valid for Betanet Rewards.')} />
            }
            <Modal.Columns hint={t<string>('')}>
              {valid && <article style={{
                margin: '1em 0 1em 2.2em', padding: '1rem'
              }}>
                For more information please see the <a
                  href='https://xxnetwork.wiki/index.php/BetaNet_Staking'
                  rel='noreferrer'
                  target='_blank'>
                  {t<string>('Program Description')}
                </a>
              </article>}
              {(!rewardOption || currRewardOption === rewardOption) && valid &&
                <MarkWarning content={t<string>('This is your current betanet rewards option.')} />
              }
            </Modal.Columns>
          </Modal.Content>
          : <div style={{ margin: '1em 4em 1em 0' }}> <MarkWarning content={t<string>('It is no longer possible to change the Betanet Reward Option.')} /> </div>
        }
        {rewardOption && <Modal.Actions>
          <TxButton
            accountId={accountId}
            icon='sign-in-alt'
            isDisabled={currRewardOption === rewardOption || !valid}
            label={t<string>('Submit Betanet Rewards Option')}
            onStart={onClose}
            params={[rewardOption.replace(/"/g, '')]}
            tx={api.tx.xxBetanetRewards.selectOption}
          />
        </Modal.Actions>}
      </Modal>
    </div>
  );
}

export default React.memo(styled(Betanet)`
      .balance {
        margin - bottom: 0.5rem;
      text-align: right;
      padding-right: 1rem;

      .label {
        opacity: 0.7;
    }
  }

      label.with-help {
        flex - basis: 10rem;
  }

      .typeToggle {
        text - align: right;
  }

      .typeToggle+.typeToggle {
        margin - top: 0.375rem;
  }
      `);
