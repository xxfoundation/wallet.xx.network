// Copyright 2017-2026 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@polkadot/keyring/types';
import type { KeyringJson, KeyringPairs$Json, KeyringStore } from '@polkadot/ui-keyring/types';

import { accountKey } from '@polkadot/ui-keyring/defaults';
import { stringToU8a, u8aToString } from '@polkadot/util';
import { jsonDecrypt, jsonEncrypt } from '@polkadot/util-crypto';

export type FileAccount = KeyringPair$Json | KeyringPair;

export type ParsedImportFile =
  | { accounts: FileAccount[]; kind: 'accounts' }
  | { batch: KeyringPairs$Json; kind: 'batch' };

// an account as @polkadot/ui-keyring stores it
export interface StoredAccount {
  encoded?: string;
  encoding?: { type?: unknown };
  meta: KeyringPair$Meta;
}

// the account stored in this browser where keyring.restoreAccounts would write
export interface StoredAccounts {
  // by an address from a file's readable account list
  byAddress: (address: string) => StoredAccount | undefined;
  // by a decrypted file entry, deriving its address exactly as restoreAccounts does
  byEntry: (entry: KeyringPair$Json) => StoredAccount | undefined;
}

export interface BatchRestore {
  // what to pass to keyring.restoreAccounts
  batch: KeyringPairs$Json;
  // how many accounts restoreAccounts will write
  imported: number;
  // names of accounts left as they are, because their key is in this browser and the file's copy has none
  skipped: string[];
}

// the part of @polkadot/ui-keyring's keyring that storedAccounts uses
interface UiKeyring {
  keyring: { createFromJson: (json: KeyringPair$Json, ignoreChecksum?: boolean) => { address: string } };
}

type JsonObject = Record<string, unknown>;

const NOT_A_BACKUP = 'Invalid format: This is not an account backup file';

function isObject (value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAccountItem (value: unknown): boolean {
  return isObject(value) && typeof value.address === 'string' && typeof value.meta === 'object' && value.meta !== null;
}

function isBatchAccount (value: unknown): boolean {
  return isAccountItem(value) && isObject(value) && isObject(value.meta) && (value.meta.name === undefined || typeof value.meta.name === 'string');
}

// a multi-account export, as written by keyring.backupAccounts
function isBatch (value: unknown): value is JsonObject {
  return isObject(value) && isObject(value.encoding) && Array.isArray(value.encoding.content) && value.encoding.content.includes('batch-pkcs8');
}

// a single-account backup, as written by keyring.backupAccount
function isKeystore (value: unknown): boolean {
  return isAccountItem(value) && isObject(value) && typeof value.encoded === 'string' && isObject(value.encoding);
}

function checkBatch (value: JsonObject): KeyringPairs$Json {
  if (typeof value.encoded !== 'string' || !value.encoded || !Array.isArray(value.accounts) || !value.accounts.length || !value.accounts.every(isBatchAccount)) {
    throw new Error('Invalid format: This multi-account export is incomplete');
  }

  return value as unknown as KeyringPairs$Json;
}

function encodingTypes (encoding?: { type?: unknown }): unknown[] {
  return ([] as unknown[]).concat(encoding?.type ?? []);
}

// a stored account that holds its key in this browser, rather than a watch-only, Ledger or multisig entry
function hasKey (stored?: StoredAccount): boolean {
  return !!stored?.encoded && !encodingTypes(stored.encoding).includes('none') && !stored.meta.isExternal && !stored.meta.isHardware && !stored.meta.isMultisig;
}

// an account without a private key: watch-only (QR or proxied), Ledger or multisig
function isKeylessMeta (meta: KeyringPair$Meta): boolean {
  return !!(meta.isExternal || meta.isHardware || meta.isMultisig);
}

function isKeyless (entry: KeyringPair$Json): boolean {
  return isKeylessMeta(entry.meta) || encodingTypes(entry.encoding).includes('none');
}

// keyring.restoreAccounts skips development test accounts and entries without encoded data
function isRestored ({ encoded, meta }: KeyringPair$Json): boolean {
  return !!encoded && !meta?.isTesting;
}

// Reads every backup format the Import modal accepts: a list of accounts (today's Export),
// a single-account backup, or a multi-account export from before the 2025 upgrade, bare or
// wrapped in [ ].
export function parseImportFile (text: string): ParsedImportFile {
  let content: unknown;

  try {
    content = JSON.parse(text);
  } catch {
    // the parser's own message quotes the start of the file, which could be a seed phrase
    throw new Error('Invalid format: This file is damaged or is not an account backup');
  }

  if (Array.isArray(content)) {
    if (content.length === 1 && isBatch(content[0])) {
      return { batch: checkBatch(content[0]), kind: 'batch' };
    } else if (content.some(isBatch)) {
      throw new Error('Invalid format: A multi-account export must be imported on its own');
    } else if (!content.every(isAccountItem)) {
      throw new Error('Invalid format: Each item must have a string "address" and an object "meta"');
    }

    return { accounts: content as FileAccount[], kind: 'accounts' };
  } else if (isBatch(content)) {
    return { batch: checkBatch(content), kind: 'batch' };
  } else if (isKeystore(content)) {
    return { accounts: [content as FileAccount], kind: 'accounts' };
  }

  throw new Error(NOT_A_BACKUP);
}

// Reads accounts from the keyring's own store rather than from the accounts the page shows:
// the page hides stored accounts tied to another network, and an extension account can stand
// in for a stored one, yet restoreAccounts overwrites both.
export function storedAccounts (keyring: UiKeyring): StoredAccounts {
  const store = (keyring as unknown as { _store: KeyringStore })._store;
  const byAddress = (address: string): StoredAccount | undefined => {
    let stored: StoredAccount | undefined;

    try {
      store.get(accountKey(address), (json: KeyringJson) => {
        stored = json as unknown as StoredAccount;
      });
    } catch {
      // an address the keyring cannot decode cannot be stored here
    }

    return stored;
  };

  return {
    byAddress,
    byEntry: (entry) => {
      try {
        // the address restoreAccounts stores the entry under (it calls addFromJson(json, true))
        return byAddress(keyring.keyring.createFromJson(entry, true).address);
      } catch {
        return undefined;
      }
    }
  };
}

// Names the accounts already in this browser that a multi-account export would replace, from
// its readable account list, so the modal can say so before the password is known.
export function previewBatchRestore (batch: KeyringPairs$Json, stored: StoredAccounts): string[] {
  return batch.accounts.reduce<string[]>((names, { address, meta }) => {
    const current = stored.byAddress(address);

    return current && !(isKeylessMeta(meta) && hasKey(current))
      ? [...names, current.meta.name || address]
      : names;
  }, []);
}

// Decrypts a multi-account export, which throws on a wrong password before anything is saved,
// and leaves out any copy without a key that would replace a stored account holding its key.
// A keyed copy still replaces the stored account, as the old wallet did.
export function prepareBatchRestore (batch: KeyringPairs$Json, password: string, stored: StoredAccounts): BatchRestore {
  const entries = JSON.parse(u8aToString(jsonDecrypt(batch, password))) as KeyringPair$Json[];
  const skipped: string[] = [];
  const kept = entries.filter((entry) => {
    if (isRestored(entry) && isKeyless(entry)) {
      const current = stored.byEntry(entry);

      if (hasKey(current)) {
        skipped.push(current?.meta.name || entry.address);

        return false;
      }
    }

    return true;
  });

  return {
    batch: skipped.length
      ? { ...jsonEncrypt(stringToU8a(JSON.stringify(kept)), ['batch-pkcs8'], password), accounts: kept.map(({ address, meta }) => ({ address, meta })) }
      : batch,
    imported: kept.filter(isRestored).length,
    skipped
  };
}
