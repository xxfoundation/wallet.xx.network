/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable header/header */

import { useWeb3 } from '@chainsafe/web3-context';
import React, { useCallback, useEffect, useState } from 'react';

import { Button, Spinner } from '@polkadot/react-components';

import { useTranslation } from './translate';
import styled from 'styled-components';

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

type Props = {
  payload: string;
  onSignatureComplete: ({ address, signature }: { address: string, signature: string }) => void,
}

const MetamaskSigner: React.FC<Props> = ({ payload, onSignatureComplete }) => {
  const { t } = useTranslation();
  const {
    address,
    checkIsReady,
    isReady,
    onboard,
    signMessage,
    wallet
  } = useWeb3();

  const [walletConnecting, setWalletConnecting] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const handleConnect = useCallback(async () => {
    setWalletConnecting(true);
    !wallet && (await onboard?.walletSelect());
    wallet && (await checkIsReady());
    setWalletConnecting(false);
  }, [setWalletConnecting, wallet, onboard, checkIsReady]);

  const handleConfirm = useCallback(() => {
    if (!address) {
      return;
    }

    setIsSigning(true);
    signMessage(payload).then((signature) => {
      onSignatureComplete({ address, signature });
    }).catch((e) => {
      console.error(e);
    }).finally(() => {
      setIsSigning(false);
      setIsSigned(true);
    });
  }, [signMessage, payload, address]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleConnect();
  }, [handleConnect]);

  if (isSigning || walletConnecting || !isReady) {
    const message = isSigning
      ? t<string>('Waiting on Metamask signature')
      : t<string>('Connecting Metamask');

    return (
      <div className='connecting'>
        <Spinner label={message} />
      </div>
    );
  }

  return (
    <>
      <Payload
        data-for='tx-payload'
        data-tip
      >
        {payload}
      </Payload>
      <Button.Group>
        <Button
          icon='sign-in-alt'
          isDisabled={isSigned}
          label={t<string>('Confirm Payload')}
          onClick={handleConfirm}
        />
      </Button.Group>
    </>
  );
};

export default MetamaskSigner;
