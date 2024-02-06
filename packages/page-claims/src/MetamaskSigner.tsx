// Copyright 2017-2023 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable object-curly-newline */

import { useAccount, useSignMessage } from 'wagmi'
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { Button, Spinner } from '@polkadot/react-components';

import { useTranslation } from './translate';

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

const MetamaskSigner: React.FC<Props> = ({ onSignatureComplete, payload }) => {
  const { t } = useTranslation();
  const { address, isConnecting } = useAccount();

  const {
    data,
    isLoading,
    signMessage
  } = useSignMessage()

  const handleConfirm = useCallback(() => {
    if (!address) {
      return;
    }
    signMessage({ message: payload})
  }, [signMessage, payload, address]);

  // Call on completion
  useEffect(() => {
    if (address && data) {
      onSignatureComplete({ address, signature: data });
    }
  }, [address, data]);

  return (
    <>
      {!isLoading && !isConnecting && (<>
        <Payload
          data-for='tx-payload'
          data-tip
        >
          {payload}
        </Payload>
        <Button.Group>
          <Button
            icon='sign-in-alt'
            isDisabled={data !== undefined}
            label={t<string>('Sign message')}
            onClick={handleConfirm}
          />
        </Button.Group>
      </>)}
      {(isLoading || isConnecting) &&
        <div className='connecting'>
          <Spinner label={isLoading ? t<string>('Waiting on Metamask signature') : t<string>('Connecting Metamask')} />
        </div>
      }
    </>
  );
};

export default MetamaskSigner;
