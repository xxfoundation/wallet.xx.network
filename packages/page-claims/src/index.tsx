// Copyright 2017-2023 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';
import type { Option } from '@polkadot/types';
import type { BalanceOf, EcdsaSignature, EthereumAddress, StatementKind } from '@polkadot/types/interfaces';

import { WagmiConfig } from 'wagmi';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Trans } from 'react-i18next';
import styled from 'styled-components';

import { Button, Card, Columar, Input, InputAddress, Tabs, Tooltip } from '@polkadot/react-components';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO, u8aToHex, u8aToString } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';

import ClaimDisplay from './Claim';
import ClaimError from './ClaimError';
import MetamaskAddress from './MetamaskAddress';
import MetamaskSigner from './MetamaskSigner';
import Statement from './Statement';
import { useTranslation } from './translate';
import { getStatement, recoverFromJSON } from './util';
import Warning from './Warning';
import { config } from './wagmi_config';

export { default as useCounter } from './useCounter';

enum Step {
  Account = 0,
  ChooseSignType = 1,
  ValidateEthAddress = 2,
  CheckClaim = 3,
  SignManual = 4,
  SignMetamask = 5,
  Claim = 5
}

// FIXME no embedded components (hossible to tweak)
const Payload = styled.pre`
  cursor: copy;
  font: var(--font-mono);
  border: 1px dashed #c2c2c2;
  background: #f2f2f2;
  padding: 1rem;
  width: 100%;
  margin: 1rem 0;
  white-space: normal;
  word-break: break-all;
`;

const Signature = styled.textarea`
  font: var(--font-mono);
  padding: 1rem;
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-radius: 0.25rem;
  margin: 1rem 0;
  resize: none;
  width: 100%;

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &::-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }

  &:-ms-input-placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const validateAddress = (input: string): boolean => {
  // Validate Ethereum address
  if (/^0x[a-fA-F0-9]{40}$/.test(input)) {
    return true
  }
  return false
}

const transformStatement = {
  transform: (option: Option<StatementKind>) => option.unwrapOr(null)
};

function ClaimsApp ({ basePath }: Props): React.ReactElement<Props> {
  const [didCopy, setDidCopy] = useState(false);
  const [ethereumAddress, setEthereumAddress] = useState<string | undefined | null>(null);
  const [signature, setSignature] = useState<EcdsaSignature | null>(null);
  const [step, setStep] = useState<Step>(Step.Account);
  const [hasClaimError, setClaimError] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const { api, systemChain } = useApi();
  const { t } = useTranslation();

  const itemsRef = useRef([{
    isRoot: true,
    name: 'create',
    text: t<string>('Claim tokens')
  }]);

  // Everytime we change account, reset everything, and check if the accountId
  // has a preclaim.
  useEffect(() => {
    if (!accountId) {
      return;
    }

    setStep(Step.Account);
    setEthereumAddress(null);

    api.query.claims
      .preclaims<Option<EthereumAddress>>(accountId)
      .then((preclaim): void => {
        const address = preclaim.unwrapOr(null)?.toString();

        setEthereumAddress(address);
      })
      .catch(() => {
        console.error('Error occured with preclaim');
      });
  }, [accountId, api.query.claims, api.query.claims.preclaims]);

  // Old claim process used `api.tx.claims.claim`, and didn't have attest
  const isOldClaimProcess = !api.tx.claims.claimAttest;

  useEffect(() => {
    if (didCopy) {
      setTimeout((): void => {
        setDidCopy(false);
      }, 1000);
    }
  }, [didCopy]);

  const fetchClaimAmount = useCallback(() => {
    return api.query.claims
      .claims<Option<BalanceOf>>(ethereumAddress ?? '');
  }, [api.query.claims, ethereumAddress]);

  const [signMethod, setSignMethod] = useState<Step.SignManual | Step.SignMetamask>();

  useEffect(() => {
    if (step === Step.CheckClaim && signMethod) {
      fetchClaimAmount()
        .then((claim) => {
          const hasClaim = claim.isSome && claim.unwrap().gt(BN_ZERO);

          if (hasClaim) {
            setStep(signMethod);
          } else {
            setClaimError(true);
          }
        })
        .catch(() => {
          setClaimError(true);
        });
    }
  }, [step, signMethod, fetchClaimAmount]);

  const goToStepAccount = useCallback(() => {
    setStep(Step.Account);
  }, []);

  const goToChooseSignType = useCallback(() => {
    setStep(Step.ChooseSignType);
  }, []);

  const validEthAddress = useCallback(() => {
    setStep(Step.CheckClaim);
  }, []);

  const goToStepSignMetamask = useCallback(() => {
    setSignMethod(Step.SignMetamask);
    setStep(Step.ValidateEthAddress);
  }, []);

  const goToStepSignManual = useCallback(() => {
    setSignMethod(Step.SignManual);
    setStep(Step.ValidateEthAddress);
  }, []);

  const goToStepClaim = useCallback(() => {
    setStep(Step.Claim);
  }, []);

  const onChangeSignature = useCallback((event: React.SyntheticEvent<Element>) => {
    const { value: signatureJson } = event.target as HTMLInputElement;

    const { ethereumAddress, signature } = recoverFromJSON(signatureJson);

    setEthereumAddress(ethereumAddress?.toString());
    setSignature(signature);
  }, []);

  const [touchedEthAddress, setTouchedEthAddress] = useState(false);
  const onChangeEthereumAddress = useCallback((value: string) => {
    setTouchedEthAddress(true);
    setEthereumAddress(value.trim());
  }, []);

  const onCopy = useCallback(() => {
    setDidCopy(true);
  }, []);

  const onSignatureComplete = useCallback(({ address, signature }: { address: string, signature: string }) => {
    setEthereumAddress(address);
    setSignature(signature as unknown as EcdsaSignature);
    goToStepClaim();
  }, [goToStepClaim]);

  // If it's 1/ not preclaimed and 2/ not the old claiming process, fetch the
  // statement kind to sign.
  const statementKind = useCall<StatementKind | null>(!isOldClaimProcess && !!ethereumAddress && api.query.claims.signing, [ethereumAddress], transformStatement);

  const statementSentence = getStatement(systemChain, statementKind)?.sentence || '';

  const privKey = accountId ? `${u8aToHex(decodeAddress(accountId), -1, false)}` : '';
  const prefix = u8aToString(api.consts.claims.prefix.toU8a(true));
  const payload = accountId
    ? `${prefix}${privKey}${statementSentence}`
    : '';

  return (
    <WagmiConfig config={config}>
      <main>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
        {!isOldClaimProcess && <Warning />}
        <Columar>
          <Columar.Column>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.5em' }}>
              <h1>
                <Trans>
                  Claim your <em>{TokenUnit.abbr}</em> tokens
                </Trans>
              </h1>
              <div style={{ margin: 'auto 0 0', textAlign: 'end' }}>
                <a
                  href='https://xxnetwork.wiki/index.php/Claiming_Tokens'
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  {t('More Information about Claims')}</a>
              </div>
            </div>
            <Card withBottomMargin>
              <h3>{t<string>('1. Select your {{chain}} account', {
                replace: {
                  chain: systemChain
                }
              })}</h3>
              <InputAddress
                defaultValue={accountId}
                help={t<string>('The account you want to claim to.')}
                label={t<string>('claim to account')}
                onChange={setAccountId}
                type='all'
              />
              {accountId &&
                <Input
                  isDisabled={true}
                  label={t<string>('Public key of this account')}
                  value={'0x' + privKey}
                />
              }
              {(step === Step.Account) && (
                <Button.Group>
                  <Button
                    icon='sign-in-alt'
                    isDisabled={!accountId}
                    label={t<string>('Continue')}
                    onClick={goToChooseSignType}
                  />
                </Button.Group>
              )}
            </Card>
            {(step >= Step.ChooseSignType) && (
              <Card withBottomMargin>
                <h3>{t<string>('{{step}}. Choose how to sign', { replace: { step: '2' } })}</h3>
                <Button.Group>
                  <Button
                    icon='wallet'
                    label={t<string>('Use Metamask')}
                    onClick={goToStepSignMetamask}
                  />
                  <Button
                    icon='pencil-alt'
                    label={t<string>('Manually Sign')}
                    onClick={goToStepSignManual}
                  />
                </Button.Group>
              </Card>
            )}
            {
              // We need to know the ethereuem address only for the new process
              // to be able to know the statement kind so that the users can sign it
              (step >= Step.ValidateEthAddress && signMethod === Step.SignManual && !isOldClaimProcess) && (
                <Card withBottomMargin>
                  <h3>{t<string>('3. Enter the ETH address from the sale.')}</h3>
                  <Input
                    autoFocus
                    className='full'
                    help={t<string>('The ethereum address you used during the pre-sale')}
                    isError={touchedEthAddress && (!ethereumAddress || !validateAddress(ethereumAddress))}
                    label={t<string>('Pre-sale ethereum address')}
                    onChange={onChangeEthereumAddress}
                    value={ethereumAddress || ''}
                  />
                  {(step === Step.ValidateEthAddress) && (
                    <Button.Group>
                      <Button
                        icon='sign-in-alt'
                        isDisabled={!ethereumAddress || !validateAddress(ethereumAddress)}
                        label={t<string>('Continue')}
                        onClick={validEthAddress}
                      />
                    </Button.Group>
                  )}
                </Card>
              )}
            {
              // We need to know the ethereuem address only for the new process
              // to be able to know the statement kind so that the users can sign it
              (step >= Step.ValidateEthAddress && signMethod === Step.SignMetamask && !isOldClaimProcess) && (
                <Card withBottomMargin>
                  <h3>{t<string>('3. Confirm ETH address from the sale.')}</h3>
                  <MetamaskAddress onChangeEthAddress={setEthereumAddress} />
                  {(step === Step.ValidateEthAddress) && (
                    <Button.Group>
                      <Button
                        icon='sign-in-alt'
                        isDisabled={!ethereumAddress || !validateAddress(ethereumAddress)}
                        label={t<string>('Confirm Address')}
                        onClick={validEthAddress}
                      />
                    </Button.Group>
                  )}
                </Card>
              )}
          </Columar.Column>
          <Columar.Column>
            {(step >= Step.CheckClaim && !isOldClaimProcess && hasClaimError) && (
              <ClaimError address={ethereumAddress} />
            )}
            {(step >= Step.SignMetamask && signMethod === Step.SignMetamask) && (
              <Card withBottomMargin>
                {!isOldClaimProcess && (
                  <Statement
                    kind={statementKind}
                    systemChain={systemChain}
                  />
                )}
                <h3>{t<string>('{{step}}. Sign with your metamask extension the following message', { replace: { step: '4' } })}</h3>
                <MetamaskSigner
                  onSignatureComplete={onSignatureComplete}
                  payload={payload}
                />
              </Card>
            )}
            {(step >= Step.SignManual && signMethod === Step.SignManual) && (
              <Card withBottomMargin>
                <h3>{t<string>('{{step}}. Sign with your ETH address', { replace: { step: '5' } })}</h3>
                {!isOldClaimProcess && (
                  <Statement
                    kind={statementKind}
                    systemChain={systemChain}
                  />
                )}
                <div>{t<string>('Copy the following string and sign it with the Ethereum account you used during the pre-sale in the wallet of your choice, using the string as the payload, and then paste the transaction signature object below:')}</div>
                <CopyToClipboard
                  onCopy={onCopy}
                  text={payload}
                >
                  <Payload
                    data-for='tx-payload'
                    data-tip
                  >
                    {payload}
                  </Payload>
                </CopyToClipboard>
                <Tooltip
                  place='right'
                  text={didCopy ? t<string>('copied') : t<string>('click to copy')}
                  trigger='tx-payload'
                />
                <div>{t<string>('Paste the signed message into the field below. The placeholder text is there as a hint to what the message should look like:')}</div>
                <Signature
                  onChange={onChangeSignature}
                  placeholder={`{\n  "address": "0x ...",\n  "msg": "${prefix}: ...",\n  "sig": "0x ...",\n  "version": "2"\n}`}
                  rows={10}
                />
                <Button.Group>
                  <Button
                    icon='sign-in-alt'
                    isDisabled={!accountId || !signature || step >= Step.Claim}
                    label={t<string>('Confirm claim')}
                    onClick={goToStepClaim}
                  />
                </Button.Group>
              </Card>
            )}
            {(step >= Step.Claim) && (
              <ClaimDisplay
                accountId={accountId}
                ethereumAddress={ethereumAddress}
                ethereumSignature={signature}
                isOldClaimProcess={isOldClaimProcess}
                onSuccess={goToStepAccount}
                statementKind={statementKind}
              />
            )}
          </Columar.Column>
        </Columar>
      </main>
    </WagmiConfig>
  );
}

export default React.memo(ClaimsApp);
