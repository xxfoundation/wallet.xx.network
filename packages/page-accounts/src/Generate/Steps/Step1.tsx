// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, Checkbox, MarkWarning } from '@polkadot/react-components';
import { bip39Generate, waitReady as waitReadyPolkadot } from '@polkadot/wasm-crypto';
import { generateSleeve, waitReady } from '@xxnetwork/wasm-crypto';

import { useTranslation } from '../../translate';
import { Element } from '../index';

interface Props {
  className?: string;
  setMnemonics: (mnemonics: string[]) => void;
  onFinish: () => void;
}

function Step1 ({ className = '', onFinish, setMnemonics }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [ackOnlineRisk, setAckOnlineRisk] = useState<boolean>(false);
  const [ackBrowserRisk, setIAckBrowserRisk] = useState<boolean>(false);
  const [isMnemonicSaved, setIsMnemonicSaved] = useState<boolean>(false);
  const [standardMnemonic, setStandardMnemonic] = useState<string>('');
  const [quantumMnemonic, setQuantumMnemonic] = useState<string>('');
  const isStepValid = !!standardMnemonic && !!quantumMnemonic && isMnemonicSaved;

  const _toggleMnemonicSaved = useCallback(
    () => setIsMnemonicSaved(!isMnemonicSaved),
    [isMnemonicSaved]
  );

  const _toggleOnlineCheckbox = useCallback(
    () => setAckOnlineRisk(!ackOnlineRisk),
    [ackOnlineRisk]
  );
  const _toggleBrowserCheckbox = useCallback(
    () => setIAckBrowserRisk(!ackBrowserRisk),
    [ackBrowserRisk]
  );

  const [online, isOnline] = useState(navigator.onLine);

  const setOnline = () => {
    console.log('You are online!');
    isOnline(true);
  };

  const setOffline = () => {
    console.log('You are offline!');
    isOnline(false);
  };

  useEffect(() => {
    window.addEventListener('offline', setOffline);
    window.addEventListener('online', setOnline);

    // cleanup if we unmount
    return () => {
      window.removeEventListener('offline', setOffline);
      window.removeEventListener('online', setOnline);
    };
  }, []);

  const generateWallet = useCallback(async () => {
    // first wait until the WASM has been loaded (async init)
    await waitReadyPolkadot();
    await waitReady();

    // generate quantum seed
    const quantum: string = bip39Generate(24);

    // generate standard seed
    const standard = generateSleeve(quantum);

    setQuantumMnemonic(quantum);
    setStandardMnemonic(standard);
    setMnemonics([standard, quantum]);
  }, [setMnemonics]);

  return (
    <div
      className={className}
      style={{ margin: '1em', width: '95%' }}
    >
      <div style={{ alignItems: 'baseline', display: 'flex', margin: '1em 0 1em 2.25em' }}>
        {online ? <span>&#128994; &nbsp;</span> : <span>&#128308; &nbsp;</span>}
        <p>You are {online ? 'Online' : 'Offline'}!</p>
      </div>
      <MarkWarning
        content='We advise you to turn off your internet connection and bluetooth until the end of the wallet generation process. This process runs completely on your browser, which means there is no need for internet connectivity. Furthermore, do not proceed if you think your browser might be compromised with malicious software.'
      />
      <div style={{ display: 'grid', margin: '1em 0 2em 2.25em', textAlign: 'left' }}>
        <Checkbox
          label={<>{t<string>('I acknowledge that I have turned off internet connectivity, or that I understand the risks of remaining connected.')}</>}
          onChange={_toggleOnlineCheckbox}
          value={ackOnlineRisk}
        />
        <Checkbox
          label={<>{t<string>('I acknowledge that I am accessing this web page through a non compromised browser.')}</>}
          onChange={_toggleBrowserCheckbox}
          value={ackBrowserRisk}
        />
      </div>
      <Button
        icon='plus'
        isDisabled={!ackOnlineRisk || !ackBrowserRisk}
        label={t<string>('Generate New Wallet')}
        onClick={generateWallet}
      />
      {quantumMnemonic &&
      <Element
        body={t<string>('This recovery phrase will only be used when the xx network consensus adopts quantum-secure signatures. Your standard recovery phrase is generated from this')}
        className='quantum'
        header='Quantum Mnemonic'
        value={quantumMnemonic}
      />}
      {standardMnemonic &&
      <Element
        body={t<string>('This recovery phrase is used like any other cryptocurrency recovery phrase. If you lose your wallet or you want to setup a hardware wallet, you can recreate it using this recovery phrase.')}
        className='standard'
        header='Standard Mnemonic'
        value={standardMnemonic}
      />}
      <div style={{ margin: '2em 1em' }}>
        <section className='mb-3'>
          <p>
            <strong>{t<string>('NOT RECOMMENDED')}</strong>
          </p>
          <ul>
            <li>{t<string>('Taking a screenshot or photo of this information')}</li>
            <li>{t<string>('Saving the information in an unencrypted text document')}</li>
            <li>
              {t<string>('Sharing this information with any person or application you do not trust with your money')}
            </li>
          </ul>
        </section>
        <section className='mb-3'>
          <p>
            <strong>{t<string>('RECOMMENDED')}</strong>
          </p>
          <ul>
            <li>
              {t<string>('Writing down on paper both recovery phrases, with the correct label, and indexes')}
            </li>
            <li>{t<string>('Keeping this information somewhere that is safe from theft and damage')}</li>
            <li>{t<string>('Using a hardware wallet')}</li>
          </ul>
        </section>
        <p>
          <strong>
            {t<string>('To learn more about our quantum-ready wallets: ')}
            <a
              className='ml-1'
              href='https://github.com/xx-labs/sleeve'
            >
                https://github.com/xx-labs/sleeve
            </a>
          </strong>
        </p>
      </div>
      {standardMnemonic && quantumMnemonic &&
        <div style={{ marginTop: '3em', textAlign: 'right' }}>
          <Checkbox
            label={<>{t<string>('I have saved both my mnemonics safely and named them correctly!')}</>}
            onChange={_toggleMnemonicSaved}
            value={isMnemonicSaved}
          />
        </div>
      }
      <div style={{ marginTop: '1.5em', textAlign: 'end' }}>
        <Button
          activeOnEnter
          icon='step-forward'
          isDisabled={!isStepValid}
          label={t<string>('Next')}
          onClick={onFinish}
        />
      </div>
    </div>);
}

export default styled(Step1)`
  .quantum {
    border-color: var(--highlight);
    color: var(--highlight);
  }

  .standard {
    border-color: forestgreen;
    color: forestgreen;
  }
`;
