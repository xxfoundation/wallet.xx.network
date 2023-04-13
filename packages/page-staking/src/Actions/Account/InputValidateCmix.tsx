// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';

import { isHex } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  onError: (error: string | null) => void;
  value: string | null;
  required: boolean;
}

function InputValidationCmix ({ onError, required, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  useEffect((): void => {
    if (required && !isHex(value, 256)) {
      const error = t('A valid cMix ID is required.');

      onError(error);
    } else {
      onError(null);
    }
  }, [onError, t, required, value]);

  return null;
}

export default React.memo(InputValidationCmix);
