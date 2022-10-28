// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RadioGroupProps } from './types';

import React, { useCallback, useState } from 'react'
import { Form, Radio } from 'semantic-ui-react'

function RadioGroup ({ title, defaultValue, value: { header, options }, OnChangeOption }: RadioGroupProps): React.ReactElement<RadioGroupProps> {
  const [selected, setSelected] = useState<string>(defaultValue);

  const _OnChange = useCallback(
    (option: string) => {
      setSelected(option),
        OnChangeOption(option)
    },
    []
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
              style={{ position: 'relative', margin: '1em' }}>
              <Form.Field>
                <Radio
                  label={header[index]}
                  name='radioGroup'
                  value={option}
                  checked={selected ? selected === option : defaultValue === option}
                  onChange={() => _OnChange(option)}
                />
              </Form.Field>
            </div>
          ))}
        </div>
      </div>
    </Form>
  )
}

export default React.memo(RadioGroup)
