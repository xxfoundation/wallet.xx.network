// Copyright 2017-2023 @polkadot/app-claims authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable react-hooks/exhaustive-deps */

import { useWeb3 } from '@chainsafe/web3-context';
import React, { useCallback, useEffect, useState } from 'react';

import { Input, Spinner } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  onChangeEthAddress: (ethereumAddress: string) => void;
}

const MetamaskAddress: React.FC<Props> = ({ onChangeEthAddress: OnChangeEthAddress }) => {
  const { t } = useTranslation();

  const { address, checkIsReady, onboard, wallet } = useWeb3();

  const [walletConnecting, setWalletConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    setWalletConnecting(true);
    !wallet && (await onboard?.walletSelect());
    wallet && (await checkIsReady());
    setWalletConnecting(false);
  }, [setWalletConnecting, wallet, onboard, checkIsReady]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleConnect();
    address && OnChangeEthAddress(address);
  }, [address, handleConnect]);

  if (walletConnecting /* || !isReady */) {
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
