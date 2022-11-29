// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

import { AccountName } from '@polkadot/react-components';
import { toShortAddress } from '@polkadot/react-components/util';

type Props = {
  available: string[];
  selected?: string[];
  onChange: (selected: string[]) => void;
  className: string;
}

const StashFilters: React.FC<Props> = ({ available, className, onChange }) => {
  const options = available.map((id) => {
    const addressMini =
      <AccountName
        style={{ paddingRight: '1rem' }}
        value={id}
        withSidebar={false}
      />;

    return {
      key: id,
      label: addressMini,
      text: ` ${toShortAddress(id)}`,
      value: id
    };
  });

  const _onChange = useCallback((_e: unknown, data: { [key: string]: any }) => {
    onChange(data.value as string[]);
  }, [onChange]);

  return (
    <Dropdown
      className={className}
      fluid
      multiple
      onChange={_onChange}
      options={options}
      placeholder='Filter by your nominator stash id'
      selection
    />
  );
};

export default React.memo(styled(StashFilters)`
  .delete.icon::before {
    content: '\\002715';
    color: red;
  }
`);
