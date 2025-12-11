// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';

interface Props {
  children?: React.ReactNode;
  className?: string;
  content?: React.ReactNode;
}

function MarkInfo ({ children, className = '', content }: Props): React.ReactElement<Props> {
  return (
    <article className={`mark ${className}`}>
      <Icon icon='exclamation-triangle' />{content}{children}
    </article>
  );
}

export default React.memo(styled(MarkInfo)`
  border-color: var(--highlight);

  .ui--Icon {
    color: var(--highlight);
    margin-right: 0.5rem;
  }
`);
