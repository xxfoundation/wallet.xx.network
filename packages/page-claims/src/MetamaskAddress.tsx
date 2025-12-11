// Copyright 2017-2023 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react-hooks/exhaustive-deps */

import { useAccount, useConnect } from 'wagmi';
import React, { useCallback, useEffect } from 'react';

import { Input, Spinner } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  onChangeEthAddress: (ethereumAddress: string) => void;
}

const MetamaskAddress: React.FC<Props> = ({ onChangeEthAddress: OnChangeEthAddress }) => {
  const { t } = useTranslation();

  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  const handleConnect = useCallback(async () => {
    try {
      connectors.map((connector) => {
        connect({ connector })
      })
      OnChangeEthAddress(address || '');
    } catch (error) {
      console.warn(`failed to connect..`, error);
    }
  }, [connectors, connect]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    if (address === undefined || !isConnected) {
      handleConnect();
    } else {
      OnChangeEthAddress(address);
    }
  }, [address, isConnected, handleConnect]);

  if (!isConnected) {
    const message = t<string>('Connecting Metamask');

    return (
      <div className='connecting'>
        <Spinner label={message} />
      </div>
    );
  }

  return (
    <>
      <Input
        className='full'
        help={t<string>('This ethereum address should be the one you used during the pre-sale')}
        isDisabled={true}
        label={t<string>('The ethereum address from your Metamask')}
        value={address}
      />
    </>
  );
};

export default MetamaskAddress;
