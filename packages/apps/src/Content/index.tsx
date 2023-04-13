// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route } from '@polkadot/apps-routing/types';

import React, { Suspense, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import createRoutes from '@polkadot/apps-routing';
import { ErrorBoundary, Spinner, StatusContext, TabsContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { findMissingApis } from '../endpoint';
import { useTranslation } from '../translate';
import NotFound from './NotFound';
import Status from './Status';

interface Props {
  className?: string;
}

const NOT_FOUND: Route = {
  Component: NotFound,
  display: {
    needsApi: undefined
  },
  group: 'settings',
  icon: 'times',
  isIgnored: false,
  name: 'unknown',
  text: 'Unknown'
};

function Content ({ className }: Props): React.ReactElement<Props> {
  const location = useLocation();
  const { t } = useTranslation();
  const { api, isApiConnected, isApiReady } = useApi();
  const { queueAction } = useContext(StatusContext);

  const { Component, display: { needsApi, needsApiInstances }, icon, name, text } = useMemo(
    (): Route => {
      const app = location.pathname.slice(1) || '';

      return createRoutes(t).find((route) => !!(route && app.startsWith(route.name))) || NOT_FOUND;
    },
    [location, t]
  );

  const missingApis = useMemo(
    () => needsApi
      ? isApiReady && isApiConnected
        ? findMissingApis(api, needsApi, needsApiInstances)
        : null
      : [],
    [api, isApiConnected, isApiReady, needsApi, needsApiInstances]
  );

  return (
    <div className={className}>
      {!missingApis && !window.location.href.includes('generate')
        ? (
          <div className='connecting'>
            <Spinner label={t<string>('Initializing connection.\n\nIf this is taking too long, please click the xx mainnet button on the left side menu and select one of the options.')} />
          </div>
        )
        : (
          <>
            <Suspense fallback='...'>
              <ErrorBoundary trigger={name}>
                <TabsContext.Provider value={{ icon, text }}>
                  {missingApis && missingApis.length
                    ? (
                      <NotFound
                        basePath={`/${name}`}
                        location={location}
                        missingApis={missingApis}
                        onStatusChange={queueAction}
                      />
                    )
                    : (
                      <Component
                        basePath={`/${name}`}
                        location={location}
                        onStatusChange={queueAction}
                      />
                    )
                  }
                </TabsContext.Provider>
              </ErrorBoundary>
            </Suspense>
            <Status />
          </>
        )
      }
    </div>
  );
}

export default React.memo(styled(Content)`
  flex-grow: 1;
  overflow: hidden auto;
  padding: 0 0 1rem 0;
  position: relative;
  width: 100%;

  .connecting {
    padding: 3.5rem 0;
  }

  & main > *:not(header):not(.hasOwnMaxWidth) {
    max-width: var(--width-full);
    margin-right: auto;
    margin-left: auto;
    width: 100%;
    padding: 0 1.5rem;
  }
`);
