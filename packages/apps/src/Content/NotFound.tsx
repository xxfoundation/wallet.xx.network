// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { RouteProps } from '@polkadot/apps-routing/types';

import React from 'react';
import { Redirect } from 'react-router';

interface Props extends RouteProps {
  missingApis?: (string | string[])[];
}

function NotFound ({ basePath, missingApis = [] }: Props): React.ReactElement {
  console.log(`Redirecting from route "${basePath}" to "/accounts"${missingApis.length ? `, missing the following APIs: ${JSON.stringify(missingApis)}` : ''}`);

  return (
    <Redirect to='/accounts' />
  );
}

export default React.memo(NotFound);
