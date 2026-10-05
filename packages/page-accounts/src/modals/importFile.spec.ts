// Copyright 2017-2026 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { KeyringPairs$Json } from '@polkadot/ui-keyring/types';

import { Keyring } from '@polkadot/keyring';
import { MemoryStore } from '@polkadot/test-support/keyring';
import { keyring } from '@polkadot/ui-keyring';
import { accountKey } from '@polkadot/ui-keyring/defaults';
import { stringToU8a } from '@polkadot/util';
import { cryptoWaitReady, jsonEncrypt } from '@polkadot/util-crypto';

import { parseImportFile, prepareBatchRestore, previewBatchRestore, storedAccounts } from './importFile.js';

const ADDRESS_ONE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
const ADDRESS_TWO = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

// The parser never decrypts, so the encrypted parts are placeholders.
const keystore = {
  address: ADDRESS_ONE,
  encoded: 'placeholder-encrypted-key',
  encoding: { content: ['pkcs8', 'sr25519'], type: ['scrypt', 'xsalsa20-poly1305'], version: '3' },
  meta: { name: 'one' }
};

const watchOnly = {
  address: ADDRESS_TWO,
  meta: { isExternal: true, name: 'two' }
};

const batch = {
  accounts: [
    { address: ADDRESS_ONE, meta: { name: 'one' } },
    { address: ADDRESS_TWO, meta: { name: 'two' } }
  ],
  encoded: 'placeholder-encrypted-accounts',
  encoding: { content: ['batch-pkcs8'], type: ['scrypt', 'xsalsa20-poly1305'], version: '3' }
};

// A multi-account export made by the pre-2025 wallet (@polkadot/ui-keyring 2.9.14, util-crypto 10.4.2)
// with throwaway keys: old-keyed (own password old-keyed-pw) and old-watch, export password old-export-pw.
const OLD_WALLET_EXPORT: KeyringPairs$Json = {
  accounts: [
    {
      address: '6VQWt7Vyrxfg6Ax5qWDaGYUMbPdv1hu3Vve1VTcPJXFJpk8E',
      meta: { genesisHash: '0x50dd5d206917bf10502c68fb4d18a59fc8aa31586f4e8856b493e43544aa82aa', isHardware: false, name: 'old-keyed', tags: [], whenCreated: 1791173958602 }
    },
    {
      address: '6VNEFnjpG65XUWfg18stDkUgaVbaRKQQmNxaQ5pFFP5NtRhh',
      meta: { genesisHash: '0x50dd5d206917bf10502c68fb4d18a59fc8aa31586f4e8856b493e43544aa82aa', isExternal: true, name: 'old-watch', whenCreated: 1791173958758 }
    }
  ],
  encoded: 'To8u4BikiqtmaNg9/1NY2bWPFQVIXQW45HrP+llsD7MAgAAAAQAAAAgAAAC8g753oxTk+E/uQbYuCb9TKicRQYLcJ5AkNftbyrnt9akOHUVTgjNraDE6gMkZyKsSmIrxu+pR+CalXqsyY5LhViA8j7u4hJf1/IELQGmL0sVLe/nxHvOHIRdxpPklTFDzN/xKO4zYgAlieJlEOiQCdiILxJ2590bP0g+NNoZlCg4/PjZ9nHaUBvdZw4r1QnZ/niZ4FpYccVLldIBDzUr2hgfE3sxx5ywyQJP9xOOrYRTXtw9l3tHq6U/Z9Kl98xLMDa652pnseGm9KM6cwrUNnvbJ4psFYvb7I1vr73wrd1Mb+Pkka1NNv7K8w4MR4BLckp5KiK23IbibiDNThRoLXso61ZrcegxxsiVdwXaXMWrsp5IliJ6Vy4s8sZ6r86WoiUofraxcIF6eQwRRSnAhV0ycBOQRec2EFpeO8CZcjqrTq/AmxGOPHKeDz6rDu258gOTzIgKzelzbvm63sWLazZ7tDXSQq+W5wsi5zPRGrbKiAWBeV0RXq6ayFZ8gG+PuN4JISGQ4Z6O+tBj6Pgz0+k9EHWQxZHCZYC42F4384+/W5rBqgQ/66NCuXdhEbUs7pWruukMnLXczyuMRssLT2K9hLd2eeikElEIJ6mWPH2LU4n2S+mXHjRgzwReJWHAma30cra9f3YD3wF3239OSdqXevq6MeVYLS34/eJCVWA6XbQRyAStUUZ8nAzgTInpmFKcnSWFW0MYtObjPLVyCavRgsUfjBbtechnj5GiSq/hdE1s3MTWKpoqJh5IqGk1Xk3+0ExbtqyA2jUZofsITLh8DTlVWKGCnGPkv80PGu4b79kpCZvHvp3IncHny1zajYo/rO6N3MaqW0gtBiW6+SJR6bQvIYxhITdVIse76dlw5h1UqayjmLfNbjq1e2YKOWY+atPGN6O4rCGpClgZe8zlkWqalWCyGJV26djvjhUckollF3N0pNBFXElpDCPlpJVl+rIgSiefRlwVu0LBrOI/rGf3T3zZAExnWLEJKIXh3Vpkjr4HqF2oysus0UNdLB5FnZzNSX+X1+5zNNvLNXqD8mi/A6+/tNO2985/W1K7YvpNn5270PW/Kc/sJB4ROoTkLEe87Z05opqsJf9qnCuiHA4xfE0UPPCTHbLAwZVXe4lLxp8S7KmJ5hE48gAvVXgL6HIc16O5YQ4XEyurTfAmvuPH6PoslRUiuYLch3HNBnuDu5GETr4hedlDr94Z3pf5i2Kvzovk7z4D+sww3LSv77mMRni/QDfbra3bK3DKwXmLbrhcvHspdnLwBMvLjwHZPchUZ2kI5Sj7b5H/e9lMzb1/smPGeiK3rdLVnRKkxECqMbG1fKZSwt5ies8MQVBiB/gYwoX0DdBzyZEp3SqM=',
  encoding: { content: ['batch-pkcs8'], type: ['scrypt', 'xsalsa20-poly1305'], version: '3' }
};

const OLD_KEYED = '6VQWt7Vyrxfg6Ax5qWDaGYUMbPdv1hu3Vve1VTcPJXFJpk8E';
const OLD_WATCH = '6VNEFnjpG65XUWfg18stDkUgaVbaRKQQmNxaQ5pFFP5NtRhh';

const POLKADOT_GENESIS = '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3';

// the store the keyring writes to, so tests can see accounts the keyring has not loaded
const store = new MemoryStore();

const storedAt = (address: string) => {
  let json: { encoding?: { type?: unknown }, meta: { name?: string } } | undefined;

  store.get(accountKey(address), (value) => {
    json = value as typeof json;
  });

  return json;
};

const asText = (value: unknown) => JSON.stringify(value);

// builds a multi-account export the way keyring.backupAccounts does, from stored account entries
const exportOf = (entries: KeyringPair$Json[], password: string): KeyringPairs$Json => ({
  ...jsonEncrypt(stringToU8a(JSON.stringify(entries)), ['batch-pkcs8'], password),
  accounts: entries.map(({ address, meta }) => ({ address, meta }))
});

const unlocks = (address: string, password: string) => {
  const pair = keyring.getPair(address);

  try {
    pair.decodePkcs8(password);
    pair.lock();

    return true;
  } catch {
    return false;
  }
};

// the keyring indexes accounts by its own address format, which differs from the old xx files'
const inThisKeyring = (address: string) => keyring.encodeAddress(keyring.decodeAddress(address));

const forget = (...addresses: string[]) => {
  for (const address of addresses) {
    if (keyring.getAccount(address)) {
      keyring.forgetAccount(address);
    }
  }
};

describe('parseImportFile', () => {
  it('passes a list through unchanged', () => {
    expect(parseImportFile(asText([keystore, watchOnly]))).toEqual({ accounts: [keystore, watchOnly], kind: 'accounts' });
  });

  it('accepts an empty list, as before', () => {
    expect(parseImportFile(asText([]))).toEqual({ accounts: [], kind: 'accounts' });
  });

  it('treats a single-account backup as a one-item list', () => {
    expect(parseImportFile(asText(keystore))).toEqual({ accounts: [keystore], kind: 'accounts' });
  });

  it('recognises a multi-account export', () => {
    expect(parseImportFile(asText(batch))).toEqual({ batch, kind: 'batch' });
  });

  it('recognises a multi-account export that was wrapped in [ ]', () => {
    expect(parseImportFile(asText([batch]))).toEqual({ batch, kind: 'batch' });
  });

  it('rejects a multi-account export mixed into a list', () => {
    for (const content of [[batch, keystore], [keystore, batch], [batch, batch]]) {
      expect(() => parseImportFile(asText(content))).toThrow(/on its own/);
    }
  });

  it('rejects a multi-account export that is missing its encrypted data or its accounts', () => {
    const withoutAccounts = { encoded: batch.encoded, encoding: batch.encoding };
    const withoutEncoded = { accounts: batch.accounts, encoding: batch.encoding };

    for (const content of [
      withoutAccounts,
      withoutEncoded,
      { ...batch, encoded: '' },
      { ...batch, accounts: [] },
      { ...batch, accounts: [{ meta: {} }] },
      { ...batch, accounts: [{ address: ADDRESS_ONE, meta: { name: { not: 'a name' } } }] },
      [withoutEncoded]
    ]) {
      expect(() => parseImportFile(asText(content))).toThrow(/incomplete/);
    }
  });

  it('rejects list items without a string address and an object meta', () => {
    for (const content of [
      [{ meta: {} }],
      [{ address: ADDRESS_ONE, meta: null }],
      [{ address: 1, meta: {} }],
      [null],
      [keystore, 'x'],
      [[keystore]]
    ]) {
      expect(() => parseImportFile(asText(content))).toThrow(/Each item must have a string "address" and an object "meta"/);
    }
  });

  it('rejects anything that is not an account backup', () => {
    const withoutEncoding = { address: keystore.address, encoded: keystore.encoded, meta: keystore.meta };

    for (const content of [
      {},
      { address: ADDRESS_ONE, meta: { name: 'one' } },
      withoutEncoding,
      { ...batch, encoding: { ...batch.encoding, content: ['pkcs8', 'sr25519'] } },
      null,
      42,
      'x',
      true
    ]) {
      expect(() => parseImportFile(asText(content))).toThrow(/not an account backup/);
    }
  });

  it('says a file that is not JSON may be damaged, without echoing it', () => {
    expect(() => parseImportFile('abandon ability able about')).toThrow('Invalid format: This file is damaged or is not an account backup');
    expect(() => parseImportFile('')).toThrow('Invalid format: This file is damaged or is not an account backup');
    expect(() => parseImportFile(asText(batch).slice(0, 40))).toThrow('Invalid format: This file is damaged or is not an account backup');
  });
});

describe('restoring a multi-account export', () => {
  beforeAll(async () => {
    await cryptoWaitReady();

    if (keyring.getAccounts().length === 0) {
      keyring.loadAll({ isDevelopment: true, store });
    }
  });

  it('reads and restores a file made by the pre-2025 wallet', () => {
    const parsed = parseImportFile(asText(OLD_WALLET_EXPORT));

    expect(parsed.kind).toBe('batch');

    const { batch: restorable, skipped } = prepareBatchRestore(OLD_WALLET_EXPORT, 'old-export-pw', storedAccounts(keyring));

    expect(skipped).toEqual([]);
    keyring.restoreAccounts(restorable, 'old-export-pw');

    expect(keyring.getAccount(inThisKeyring(OLD_KEYED))?.meta.name).toBe('old-keyed');
    expect(keyring.getAccount(inThisKeyring(OLD_WATCH))?.meta.isExternal).toBe(true);
    expect(unlocks(OLD_KEYED, 'old-keyed-pw')).toBe(true);
    expect(unlocks(OLD_KEYED, 'old-export-pw')).toBe(false);

    forget(inThisKeyring(OLD_KEYED), inThisKeyring(OLD_WATCH));
  });

  it('refuses a wrong export password before anything is saved', () => {
    expect(() => prepareBatchRestore(OLD_WALLET_EXPORT, 'wrong-pw', storedAccounts(keyring))).toThrow(/Unable to decode using the supplied passphrase/);
    expect(keyring.getAccount(inThisKeyring(OLD_KEYED))).toBeUndefined();
    expect(keyring.getAccount(inThisKeyring(OLD_WATCH))).toBeUndefined();
  });

  it('never replaces an account whose key is in this browser with a copy that has no key', () => {
    const elsewhere = new Keyring({ type: 'sr25519' });
    const here = keyring.addUri('//ImportFileSpecHere', 'here-pw', { name: 'signs-here' }).pair.address;
    const watchCopy = elsewhere.addFromAddress(here, { isExternal: true, name: 'phone-watch' }).toJson();
    const other = elsewhere.addFromUri('//ImportFileSpecOther', { name: 'other' }).toJson('other-pw');
    const file = exportOf([watchCopy, other], 'export-pw');

    const { batch: restorable, skipped } = prepareBatchRestore(file, 'export-pw', storedAccounts(keyring));

    expect(skipped).toEqual(['signs-here']);
    keyring.restoreAccounts(restorable, 'export-pw');

    expect(keyring.getAccount(here)?.meta.isExternal).toBeFalsy();
    expect(keyring.getAccount(here)?.meta.name).toBe('signs-here');
    expect(unlocks(here, 'here-pw')).toBe(true);
    expect(keyring.getAccount(other.address)?.meta.name).toBe('other');

    forget(here, other.address);
  });

  it('recognises an account whose key is here whatever address format the file uses', () => {
    const elsewhere = new Keyring({ ss58Format: 55, type: 'sr25519' });
    const here = keyring.addUri('//ImportFileSpecFormat', 'here-pw', { name: 'signs-here-too' }).pair.address;
    const watchCopy = elsewhere.addFromAddress(here, { isExternal: true, name: 'phone-watch' }).toJson();

    expect(watchCopy.address).not.toBe(here);

    const { skipped } = prepareBatchRestore(exportOf([watchCopy], 'export-pw'), 'export-pw', storedAccounts(keyring));

    expect(skipped).toEqual(['signs-here-too']);

    forget(here);
  });

  it('protects a stored key the page does not show, such as an account tied to another network', () => {
    const elsewhere = new Keyring({ type: 'sr25519' });
    const hiddenKey = elsewhere.addFromUri('//ImportFileSpecHidden', { genesisHash: POLKADOT_GENESIS, name: 'hidden-here' }).toJson('hidden-pw');

    // stored by an earlier session, but not loaded: the wallet hides accounts tied to another network
    store.set(accountKey(hiddenKey.address), hiddenKey, () => undefined);
    expect(keyring.getAccount(hiddenKey.address)).toBeUndefined();

    const watchCopy = elsewhere.addFromAddress(hiddenKey.address, { isExternal: true, name: 'phone-watch' }).toJson();
    const { batch: restorable, skipped } = prepareBatchRestore(exportOf([watchCopy], 'export-pw'), 'export-pw', storedAccounts(keyring));

    expect(skipped).toEqual(['hidden-here']);
    keyring.restoreAccounts(restorable, 'export-pw');
    expect(storedAt(hiddenKey.address)?.meta.name).toBe('hidden-here');
    expect(storedAt(hiddenKey.address)?.encoding?.type).toEqual(['scrypt', 'xsalsa20-poly1305']);

    store.remove(accountKey(hiddenKey.address), () => undefined);
  });

  it('ignores the entries restoreAccounts ignores, such as development test accounts', () => {
    const elsewhere = new Keyring({ type: 'sr25519' });
    const devTestAccount = { address: elsewhere.addFromUri('//ImportFileSpecDev').address, meta: { isTesting: true, name: 'dev-test' } };
    const mine = elsewhere.addFromUri('//ImportFileSpecMine', { name: 'mine' }).toJson('mine-pw');
    const file = exportOf([devTestAccount as unknown as typeof mine, mine], 'export-pw');

    const { batch: restorable, skipped } = prepareBatchRestore(file, 'export-pw', storedAccounts(keyring));

    expect(skipped).toEqual([]);
    keyring.restoreAccounts(restorable, 'export-pw');
    expect(keyring.getAccount(mine.address)?.meta.name).toBe('mine');

    forget(mine.address);
  });

  it('does not block a restore over an Ethereum-style watch-only entry', () => {
    const ethWatch = new Keyring({ type: 'ethereum' }).addFromAddress(`0x${'ab'.repeat(20)}`, { isExternal: true, name: 'eth-watch' }).toJson();

    expect(() => prepareBatchRestore(exportOf([ethWatch], 'export-pw'), 'export-pw', storedAccounts(keyring))).not.toThrow();
  });

  it('counts what it will import, so the modal can say when nothing was', () => {
    const elsewhere = new Keyring({ type: 'sr25519' });
    const here = keyring.addUri('//ImportFileSpecCount', 'here-pw', { name: 'count-here' }).pair.address;
    const watchCopy = elsewhere.addFromAddress(here, { isExternal: true, name: 'phone-watch' }).toJson();

    expect(prepareBatchRestore(exportOf([watchCopy], 'export-pw'), 'export-pw', storedAccounts(keyring)).imported).toBe(0);
    expect(prepareBatchRestore(OLD_WALLET_EXPORT, 'old-export-pw', storedAccounts(keyring)).imported).toBe(2);

    forget(here);
  });

  it('previews which accounts already here a file would replace, before the password is known', () => {
    const elsewhere = new Keyring({ type: 'sr25519' });
    const keyedHere = keyring.addUri('//ImportFilePreviewKeyed', 'pw', { name: 'keyed-here' }).pair.address;
    const watchHere = keyring.addExternal(keyring.encodeAddress(new Uint8Array(32).fill(9)), { name: 'watch-here' }).pair.address;
    const hidden = elsewhere.addFromUri('//ImportFilePreviewHidden', { genesisHash: POLKADOT_GENESIS, name: 'hidden-here' }).toJson('pw');

    store.set(accountKey(hidden.address), hidden, () => undefined);

    const file = exportOf([
      elsewhere.addFromAddress(keyedHere, { isExternal: true, name: 'watch-copy' }).toJson(), // kept: its key is here
      elsewhere.addFromAddress(watchHere, { isExternal: true, name: 'watch-copy-2' }).toJson(), // replaced
      elsewhere.addFromUri('//ImportFilePreviewHidden', { name: 'keyed-copy' }).toJson('pw'), // replaced, though hidden
      elsewhere.addFromUri('//ImportFilePreviewNew', { name: 'new' }).toJson('pw') // not here
    ], 'export-pw');

    expect(previewBatchRestore(file, storedAccounts(keyring))).toEqual(['watch-here', 'hidden-here']);

    forget(keyedHere, watchHere);
    store.remove(accountKey(hidden.address), () => undefined);
  });

  it('still replaces an account with a keyed copy from the file, as the modal warns', () => {
    const elsewhere = new Keyring({ type: 'sr25519' });
    const here = keyring.addUri('//ImportFileSpecReplaced', 'new-pw', { name: 'current' }, 'sr25519').pair.address;
    const olderCopy = elsewhere.addFromUri('//ImportFileSpecReplaced', { name: 'older' }).toJson('old-pw');
    const file = exportOf([olderCopy], 'export-pw');

    const { batch: restorable, skipped } = prepareBatchRestore(file, 'export-pw', storedAccounts(keyring));

    expect(skipped).toEqual([]);
    keyring.restoreAccounts(restorable, 'export-pw');

    expect(keyring.getAccount(here)?.meta.name).toBe('older');
    expect(unlocks(here, 'old-pw')).toBe(true);

    forget(here);
  });

  it('restores every kind of account from a real export, and keyed accounts keep their own password', async () => {
    const keyed = keyring.addUri('//ImportFileSpec', 'account-pw', { name: 'keyed' }).pair.address;
    const watch = keyring.addExternal(keyring.encodeAddress(new Uint8Array(32).fill(7)), { name: 'watch' }).pair.address;
    const multi = keyring.addMultisig([keyed, watch], 2, { name: 'multi' }).pair.address;
    const exported = await keyring.backupAccounts([keyed, watch, multi], 'export-pw');

    forget(keyed, watch, multi);
    expect(parseImportFile(asText([exported])).kind).toBe('batch');

    const { batch: restorable } = prepareBatchRestore(exported, 'export-pw', storedAccounts(keyring));

    keyring.restoreAccounts(restorable, 'export-pw');

    expect(keyring.getAccount(keyed)?.meta.name).toBe('keyed');
    expect(keyring.getAccount(watch)?.meta.isExternal).toBe(true);
    expect(keyring.getAccount(multi)?.meta.isMultisig).toBe(true);
    expect(unlocks(keyed, 'account-pw')).toBe(true);
    expect(unlocks(keyed, 'export-pw')).toBe(false);

    forget(keyed, watch, multi);
  });
});
