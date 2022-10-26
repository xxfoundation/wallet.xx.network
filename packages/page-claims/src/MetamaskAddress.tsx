/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable header/header */

import { useWeb3 } from '@chainsafe/web3-context';
import React, { useCallback, useEffect, useState } from 'react';

import { Input, Spinner } from '@polkadot/react-components';

import { useTranslation } from './translate';

interface Props {
  OnChangeEthAddress: (ethereumAddress: string) => void;
}

const MetamaskAddress: React.FC<Props> = ({ OnChangeEthAddress }) => {
  const { t } = useTranslation();
  const { address,
    checkIsReady,
    isReady,
    onboard,
    wallet } = useWeb3();

  const [walletConnecting, setWalletConnecting] = useState(false);

  const handleConnect = useCallback(async () => {
    setWalletConnecting(true);
    !wallet && (await onboard?.walletSelect());
    wallet && (await checkIsReady());
    setWalletConnecting(false);
  }, [setWalletConnecting, wallet, onboard, checkIsReady]);

  useEffect(() => {
    handleConnect();
    address && OnChangeEthAddress(address);
  }, [handleConnect]);

  if (walletConnecting || !isReady) {
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
