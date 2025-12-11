// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface HeaderProps {
  className?: string;
  header?: React.ReactNode;
  onClose: () => void;
}

export interface ColumnsProps {
  children: React.ReactNode;
  className?: string;
  hint?: React.ReactNode;
}

type ModalSize = 'large' | 'medium' | 'small'

export interface ModalProps {
  size?: ModalSize;
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  open?: boolean;
  onClose: () => void;
  testId?: string;
  [index: string]: any;
}

export interface ActionsProps {
  className?: string;
  children: React.ReactNode;
}

export interface BodyProps {
  size: ModalSize;
}

export interface ContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface RadioGroupProps {
  title: string;
  defaultValue: string;
  value: { header: string[], options: string[] };
  onChangeOption: (option: string) => void;
}

export type ModalType = React.FC<ModalProps> & {
  Actions: React.FC<ActionsProps>;
  Columns: React.FC<ColumnsProps>;
  Content: React.FC<ContentProps>;
  RadioGroup: React.FC<RadioGroupProps>;
};
