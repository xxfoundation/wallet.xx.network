// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ModalType } from './types';

import Actions from './Actions';
import ModalBase from './Base';
import Columns from './Columns';
import Content from './Content';
import RadioGroup from './RadioGroup';

const Modal = ModalBase as unknown as ModalType;

Modal.Actions = Actions;
Modal.Columns = Columns;
Modal.Content = Content;
Modal.RadioGroup = RadioGroup;

export default Modal;
