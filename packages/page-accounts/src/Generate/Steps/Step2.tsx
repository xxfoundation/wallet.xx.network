// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Button, Input } from '@polkadot/react-components';
import { useStepper } from '@polkadot/react-hooks';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  mnemonics: string[];
  onFinish: () => void;
}

interface MnemonicGridProps {
  mnemonic: string[];
  indexes: number[];
  onValid: () => void;
}

const getRandomSet = (array: number[], n: number): number[] => {
  const shuffled = array.sort(() => 0.5 - Math.random());

  return shuffled.slice(0, n);
};

const MnemonicGrid = ({ indexes, mnemonic, onValid }: MnemonicGridProps): React.ReactElement => {
  const [word1, setWord1] = useState<string>('');
  const [word2, setWord2] = useState<string>('');
  const [word3, setWord3] = useState<string>('');
  const [word4, setWord4] = useState<string>('');
  const [word5, setWord5] = useState<string>('');

  const isValid = useMemo(() => {
    return mnemonic.indexOf(word1) === indexes[0] &&
    mnemonic.indexOf(word2) === indexes[1] &&
    mnemonic.indexOf(word3) === indexes[2] &&
    mnemonic.indexOf(word4) === indexes[3] &&
    mnemonic.indexOf(word5) === indexes[4];
  }, [indexes, mnemonic, word1, word2, word3, word4, word5]);

  const result = useMemo(() => (
    <>
      <Input
        key={indexes[0]}
        label={`Word #${indexes[0] + 1}`}
        onChange={setWord1}
      />
      <Input
        key={indexes[1]}
        label={`Word #${indexes[1] + 1}`}
        onChange={setWord2}
      />
      <Input
        key={indexes[2]}
        label={`Word #${indexes[2] + 1}`}
        onChange={setWord3}
      />
      <Input
        key={indexes[3]}
        label={`Word #${indexes[3] + 1}`}
        onChange={setWord4}
      />
      <Input
        key={indexes[4]}
        label={`Word #${indexes[4] + 1}`}
        onChange={setWord5}
      />
    </>
  ), [indexes]);

  const button = useMemo(() => (
    <div style={{ textAlign: 'end' }}>
      <Button
        activeOnEnter
        icon='step-forward'
        isDisabled={!isValid}
        label={'Next'}
        onClick={onValid}
      />
    </div>
  ), [isValid, onValid]);

  return (<>
    {result}
    {button}
  </>);
};

function Step2 ({ className = '', mnemonics, onFinish }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [step, nextStep] = useStepper();

  const standard = useMemo(() => mnemonics[0].split(' ').map((elem) => elem), [mnemonics]);
  const standardIndexes = useMemo(() => getRandomSet(Array.from(Array(standard.length).keys()), 5), [standard.length]);

  const quantum = useMemo(() => mnemonics[1].split(' ').map((elem) => elem), [mnemonics]);
  const quantumIndexes = useMemo(() => getRandomSet(Array.from(Array(quantum.length).keys()), 5), [quantum.length]);

  return (
    <div
      className={className}
      style={{ margin: '1em', width: '95%' }}
    >
      <h2>{t<string>('Confirm Mnemonics')}</h2>
      {step === 1 &&
      <div style={{ margin: '1.5em 0' }}>
        <p className='quantum'><b>QUANTUM</b> mnemonic</p>
        <MnemonicGrid
          indexes={quantumIndexes}
          mnemonic={quantum}
          onValid={nextStep}
        />
      </div>
      }
      {step === 2 &&
      <div style={{ margin: '1.5em 0' }}>
        <p className='standard'><b>STANDARD</b> mnemonic</p>
        <MnemonicGrid
          indexes={standardIndexes}
          mnemonic={standard}
          onValid={nextStep}
        />
      </div>
      }
      {step === 3 &&
      <div style={{ margin: '1.5em 0' }}>
        <p>{t<string>('Nicely done! You are now ready to use your wallet.')}</p>
        <div style={{ textAlign: 'end' }}>
          <Button
            activeOnEnter
            icon='step-forward'
            label={'Go to Last Step'}
            onClick={onFinish}
          />
        </div>
      </div>
      }
    </div>);
}

export default styled(Step2)`
  .quantum {
    font-size: 20px;
    color: var(--highlight);
  }

  .standard {
    font-size: 20px;
    color: forestgreen;
  }
`;
