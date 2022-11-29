// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';

interface Props {
  children?: React.ReactNode;
  className: string;
}

function AnimatedEllipsis ({ children, className = '' }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={className}
      title={t<string>('Loading, please wait.')}
    >
      {children}
    </div>
  );
}

export default React.memo(styled(AnimatedEllipsis)`
  &:after {
    color:  var(--color-text);
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ellipsis steps(4,end) 1500ms infinite;      
    animation: ellipsis steps(4,end) 1500ms infinite;
    content: "\\2026";
    width: 0px;
  }

  @keyframes ellipsis {
    to {
      width: 1.25em;    
    }
  }

  @-webkit-keyframes ellipsis {
    to {
      width: 1.25em;    
    }
  }
`);
