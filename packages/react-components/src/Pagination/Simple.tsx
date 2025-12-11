// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Button from '../Button/Button';
import { useTranslation } from '../translate';

type Props = {
  previous?: () => void;
  next?: () => void;
}

const PaginationSimple = ({ next, previous }: Props): React.ReactElement<Props> => {
  const { t } = useTranslation();

  return (
    <div>
      <Button
        className='as-link'
        isDisabled={!previous}
        onClick={previous}
      >
        &#8592; {t('previous')}
      </Button>
      <Button
        className='as-link'
        isDisabled={!next}
        onClick={next}
      >
        {t('next')} &#8594;
      </Button>
    </div>
  );
};

export default React.memo(styled(PaginationSimple)`
  display: flex;
  justify-content: space-between;

  .as-link {
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: inline;
    color: var(--highlight);
  
    &:disabled, button[disabled] {
      color: gray;
      &:hover {
        cursor: not-allowed;
      }
    }
  
    &:hover:not(:disabled) {
      color: darken(var(--highlight), 5%) !important;
      transition: color 0.3s ease-in-out;
    }

    &:active,
    &:focus {
      border: none;
      box-shadow: unset;
    }
  }
`);
