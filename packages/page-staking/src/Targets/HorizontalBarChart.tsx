// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

type TooltipProps = {
  visible: boolean;
  color: string;
};

export const Tooltip = styled.span<TooltipProps>`
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

const ProgressBar = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  float: left;
  position: relative;
  overflow: initial;
  cursor: default;
  height: 100%;
  font-size: 0.75rem;
  font-weight: 300;
  background-color: ${({ color }) => color};
  text-overflow: clip;

  &:first-child {
    border-top-left-radius: 0.25rem;
    border-bottom-left-radius: 0.25rem;
  }

  &:last-child {
    border-top-right-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;
  }
`;

export const Progress = styled.div`
  height: 1.25rem;
  border-radius: 0.25rem;
`;

type Item = {
  label: string;
  value: BN;
}

type Props = {
  items: Item[];
}

const colors = ['var(--secondary)', 'var(--highlight)', 'var(--tertiary)'];

const toFixed = (percent: number) => (Math.floor(percent * 10) / 10).toFixed(1);

const HorizontalBarChart: React.FC<Props> = ({ items }) => {
  const [hovered, setHovered] = useState<number>();
  const total = items.reduce((acc, { value }) => acc.add(value), BN_ZERO);
  const percents = items.map(({ value }) => (value.toNumber() / total.toNumber()) * 100);

  const _setHovered = useCallback((index?: number) => () => setHovered(index), [setHovered]);

  return (
    <Progress>
      {
        items.map((item, index) => percents[index] !== 0 && (
          <ProgressBar
            className='progress-bar'
            color={colors[index]}
            key={index}
            onMouseEnter={_setHovered(index)}
            onMouseLeave={_setHovered(undefined)}
            style={{
              width: `${toFixed(percents[index])}%`
            }}
            title={`${item.label}`}
          >
            <Tooltip
              color={colors[index]}
              visible={hovered === index}
            >
              {item.label}: <FormatBalance value={item.value} />
            </Tooltip>
          </ProgressBar>
        ))
      }
    </Progress>
  );
};

export default HorizontalBarChart;
