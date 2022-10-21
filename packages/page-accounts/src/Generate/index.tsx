// Copyright 2017-2022 @xxnetwork authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';

import { useStepper } from '@polkadot/react-hooks';

import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';

interface ElementProps {
  className?: string;
  header: string;
  value: string;
  body?: string;
  noIndex?: boolean;
}

const HighlightedValue = ({ value }: {value: string}): JSX.Element => (
  <article style={{
    background: 'var(--highlight-contrast)',
    borderLeft: '5px solid black',
    borderStyle: 'outset'
  }}
  >
    {value}
  </article>
);

export const Element = ({ body, className = '', header, value, noIndex }: ElementProps): JSX.Element => (
  <article
    className={className}
    style={{ margin: '1em 0' }}
  >
    <div style={{ marginBottom: '1em' }}><b>{header}</b>:</div>
    {body && <p style={{ color: 'black' }}>{body}</p>}
    <div style={{ display: 'flex', flexFlow: 'wrap' }}>
      {value &&
    value.split(' ').map((elem, index) => {
      return (
        <>
          <HighlightedValue
            key={index}
            value={noIndex ? elem : `${index + 1}) `.concat(elem)}
          />
        </>);
    }
    )}</div>
  </article>
);

interface Props {
  className?: string;
}

function Generate ({ className = '' }: Props): React.ReactElement {
  const [step, nextStep] = useStepper();
  const [mnemonics, setMnemonics] = useState<string[]>(['', '']);

  const _onFinish = useCallback(() => {
    window.location.hash = '/explorer';
  }, []);

  return (
    <div
      className={className}
      style={{ margin: '1em', width: '95%' }}
    >
      {step === 1 &&
      <Step1
        onFinish={nextStep}
        setMnemonics={setMnemonics}
      />}
      {step === 2 &&
      <Step2
        mnemonics={mnemonics}
        onFinish={nextStep}
      />}
      {step === 3 &&
      <Step3
        onFinish={_onFinish}
        standardMnemonic={mnemonics[0]}
      />
      }
    </div>
  );
}

export default Generate;
