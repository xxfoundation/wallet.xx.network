// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import styled from 'styled-components';

export default styled.div`
  cursor: pointer;
  padding: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &.selected,
  &:hover {
    background: var(--hover-highlight);
  }

  .endpoint-icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .endpoint-label, label {
    font-size: 12px;
    color: var(--highlight-contrast);
    cursor: inherit;
    text-align: center;
  }

  .endpoint-disabled {
    font-size: 12px;
    color: var(--highlight-disabled);
    cursor: inherit;
    text-align: center;
  }

  .endpoint-icon-disabled {
    background: var(--highlight-disabled);
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: 0.75rem;
  }
`;
