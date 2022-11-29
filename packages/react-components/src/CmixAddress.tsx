// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable multiline-ternary */

import base64url from 'base64url';
import React from 'react';
import { useTranslation } from 'react-i18next';

const toBase64Url = (addr: string) => base64url.fromBase64(addr);
const shortHash = (addr: string) => addr
  ? addr.slice(0, 4).concat('...', addr.slice(addr.length - 4, addr.length))
  : '';

const toDashboardNodeUrl = (addr: string) => {
  const basedAf = toBase64Url(addr);

  return `https://dashboard.xx.network/nodes/${basedAf}`;
};

const CmixAddress: React.FC<{ nodeId?: string, shorten?: boolean, className?: string }> = ({ className, nodeId, shorten }) => {
  const { t } = useTranslation();

  return (
    !nodeId ? (
      <code
        className={className}
        style={{ fontSize: '0.9rem', textAlign: 'right' }}
      >
        <p>
          {t('Offline')}
        </p>
      </code>
    ) : (
      <code
        className={className}
        style={{ fontSize: '0.9rem' }}
      >
        <a
          href={toDashboardNodeUrl(nodeId)}
          rel='noreferrer noopener'
          target='__blank'
        >
          { shorten
            ? shortHash(nodeId)
            : nodeId
          }
        </a>
      </code>
    )
  );
};

export default CmixAddress;
