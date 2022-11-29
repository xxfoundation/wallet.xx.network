// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import { Form, Radio } from 'semantic-ui-react';

import { RadioGroupProps } from './types';

function RadioGroup ({ defaultValue, onChangeOption, title, value: { header, options } }: RadioGroupProps): React.ReactElement<RadioGroupProps> {
  const [selected, setSelected] = useState<string>(defaultValue);

  const _onChange = useCallback(
    (option: string) => () => {
      setSelected(option);
      onChangeOption(option);
    },
    [onChangeOption]
  );

  return (
    <Form>
      <div style={{ margin: '1em 2.2em' }}>
        <Form.Field>
          {title}
        </Form.Field>
        <Form.Field>
          Selected value: <b>{header[options.indexOf(selected)]}</b>
        </Form.Field>
        <div>
          {options.map((option, index): React.ReactNode => (
            <div
              key={index}
              style={{ margin: '1em', position: 'relative' }}
            >
              <Form.Field>
                <Radio
                  checked={selected ? selected === option : defaultValue === option}
                  label={header[index]}
                  name='radioGroup'
                  onChange={_onChange(option)}
                  value={option}
                />
              </Form.Field>
            </div>
          ))}
        </div>
      </div>
    </Form>
  );
}

export default React.memo(RadioGroup);
