// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

const MIGRATING_FROM = 'explorer.xx.network';
const MIGRATING_TO = 'wallet.xx.network';

if (location.hostname === MIGRATING_TO && !localStorage.getItem('local-storage-migrated')) {
  window.addEventListener(
    'message',
    function (e) {
      if (e.origin === `https://${MIGRATING_FROM}`) {
        try {
          const event = JSON.parse(String(e.data)) as unknown as { type: string, entries: [string, string][] };

          if (event.type === 'localStorageTransfer') {
            event.entries.forEach(([key, value]) => {
              localStorage.setItem(key, value);
            });
          }

          localStorage.setItem('local-storage-migrated', 'true');
        } catch (e) {
          console.error('Tried migrating localstorage and failed');
        }
      }
    }
  );

  const iframe = document.createElement('iframe');

  iframe.hidden = true;
  iframe.src = `https://${MIGRATING_FROM}/transfer-localstorage.html`;

  document.body.appendChild(iframe);
}

export {};
