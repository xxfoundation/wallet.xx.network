// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import styled from 'styled-components';

import ApiInfo from './ApiInfo';
import Networks from './Networks';

interface Props {
  className?: string;
}

const SideMenu: React.FC<Props> = ({ className }) => {
  return <menu className={`${className ?? ''} highlight--bg`}>
    <ApiInfo className='api-info' />
    <Networks />
  </menu>;
};

export default React.memo(styled(SideMenu)`
  transition: all 0.3s ease-in;
  z-index: 230;
  width: var(--sidebar-width);
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;

  .api-info {
    height: 2.9rem;
  }
`);
