/* eslint-disable header/header */
import React, { useCallback, useRef, useState } from 'react';

import { useTranslation } from '@polkadot/app-storage/translate';
import { Button } from '@polkadot/react-components';

type Props = { onChange: (json: unknown) => void } & React.HTMLProps<HTMLInputElement>;

const acceptedFormats = ['application/json', 'text/plain'].join(', ');

const NOOP = (): void => undefined;

function JSONInputButton ({ onChange, ...props }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const input = useRef<HTMLInputElement|null>(null);

  const onClick = useCallback(() => {
    input.current?.click();
  }, [input]);

  const _onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((evt) => {
    setValue(evt.target.value);

    if (evt.target.files) {
      const reader = new FileReader();

      reader.onabort = NOOP;
      reader.onerror = NOOP;

      reader.onload = ({ target }: ProgressEvent<FileReader>): void => {
        if (target && target.result) {
          const json = JSON.parse(target.result.toString()) as unknown;

          onChange && onChange(json);
          setValue('');
        }
      };

      reader.readAsText(evt.target.files[0]);
    }
  }, [onChange]);

  return <>
    <input
      {...props}
      accept={acceptedFormats}
      onChange={_onChange}
      ref={input}
      style={{ display: 'none' }}
      type='file'
      value={value}
    />
    <Button
      icon='plus'
      label={t<string>('Import')}
      onClick={onClick}
    />
  </>;
}

export default JSONInputButton;
