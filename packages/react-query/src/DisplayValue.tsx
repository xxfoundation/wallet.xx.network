// Copyright 2017-2023 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
  value?: string;
}

function DisplayValue ({ children, className = '', label, value }: Props): React.ReactElement<Props> | null {

  if (!value) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <span>{value}</span>
    </div>
  );
}

export default React.memo(styled(DisplayValue)`
  span+span {
    padding-left: 0.25em;
  }
`);
