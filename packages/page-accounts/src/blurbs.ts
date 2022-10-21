/* eslint-disable header/header */

import type { Data } from '@polkadot/types';
import type { IdentityInfoAdditional } from '@polkadot/types/interfaces';

import { u8aToString } from '@polkadot/util';

const CHUNK_ELEMENT_SIZE = 32;
const CHUNK_LABEL_SIZE = 'Blurb#'.length;
const CHUNK_MINUS_LABEL = CHUNK_ELEMENT_SIZE - CHUNK_LABEL_SIZE;
const CHUNK_TUPLE_SIZE = CHUNK_MINUS_LABEL + CHUNK_ELEMENT_SIZE;

const BLURB_SIZE_WITHOUT_OVERFLOW = 4 * CHUNK_ELEMENT_SIZE;

export const BLURB_MAX_SIZE = CHUNK_TUPLE_SIZE * 4;

function dataToString (data: Data) {
  return u8aToString(data.asRaw.toU8a(true));
}

export function decodeBlurb (blurb: Array<[string, string]>) {
  return blurb
    .filter(([part1]) => part1.startsWith('Blurb'))
    .map(([part1, part2]) => part1.substr(CHUNK_LABEL_SIZE).concat(part2))
    .join('');
}

export function decodeBlurbData (additional: Array<IdentityInfoAdditional>) {
  const stringified = additional
    .map((info) => {
      const [key, value] = info.map(dataToString);

      return [key, value] as [string, string];
    });

  return decodeBlurb(stringified);
}

export function encodeBlurb (b: string, okBlurb: boolean) {
  let blurb = b.replace(/\n/g, ' ');
  let overflowAmount = Math.max(blurb.length - BLURB_SIZE_WITHOUT_OVERFLOW, 0);
  const chunks = [];
  let index = 1;

  while (blurb.length > 0) {
    let overflow = '';

    if (overflowAmount > 0) {
      const size = Math.min(overflowAmount, CHUNK_MINUS_LABEL);

      overflow = blurb.substr(0, size);
      blurb = blurb.substr(size);
      overflowAmount -= size;
    }

    const value = blurb.substr(0, CHUNK_ELEMENT_SIZE);

    blurb = blurb.substr(CHUNK_ELEMENT_SIZE);

    chunks.push([
      {
        [okBlurb ? 'raw' : 'none']: `Blurb${index}${overflow}` || null
      },
      {
        [okBlurb ? 'raw' : 'none']: value
      }
    ]);
    index += 1;
  }

  return chunks;
}
