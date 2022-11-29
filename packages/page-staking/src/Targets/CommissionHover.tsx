// Copyright 2017-2022 @polkadot/app-preimages authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

type TooltipProps = {
  visible: boolean;
  color: string;
};

const Tooltip = styled.span<TooltipProps>`
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  position: absolute;
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  min-width: 100px;
  text-align: center;
  border-radius: 5px;
  z-index: 1;
  padding: 1rem;
  font-size: 12px;
  bottom: 125%;
  transition: 140ms;
  z-index: 15;
  border-width: 1px;
  border-style: solid;
  background-color: white;
  box-shadow: 0 3px 3px rgba(0,0,0,.2);
  border-color: ${({ color }) => color};

  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ color }) => `${color} transparent transparent transparent`};
  }
`;

const Commission = styled.div<{ isCommissionReducing: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  float: right;
  position: relative;
  overflow: initial;
  cursor: default;
  height: 100%;
  color: ${({ isCommissionReducing }) => isCommissionReducing ? 'red' : 'black'};
`;

type Props = {
  isCommissionReducing: boolean;
  commission: number;
  avgCommission: number;
}

const CommissionHover: React.FC<Props> = ({ avgCommission, commission, isCommissionReducing }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const _setHovered = useCallback((val: boolean) => () => setHovered(val), [setHovered]);

  return (
    <Commission
      className='commissiom'
      isCommissionReducing={isCommissionReducing}
      onMouseEnter={_setHovered(true)}
      onMouseLeave={_setHovered(false)}
    >
      {commission.toFixed(2)}%
      <Tooltip
        color={isCommissionReducing ? 'red' : 'black'}
        visible={hovered}
      >
        <span style={{ color: 'black' }}>Average commission of past 7 eras:</span> {avgCommission.toFixed(2)}%
      </Tooltip>
    </Commission>
  );
};

export default CommissionHover;
