// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

const KEY_PREFIX = 'xxnetwork';

type SetAction<S> = S | ((prevState: S) => S);
type Dispatch<A> = (value: A) => void;

function prefix (key: string) {
  return `${KEY_PREFIX}.${key}`;
}

function useStorage <S> (key: string, initialValue: S, store = localStorage): [S, Dispatch<SetAction<S>>] {
  const [storedValue, setStoredValue] = useState<S>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = store.getItem(prefix(key));

      return (item ? JSON.parse(item) : initialValue) as S;
    } catch (error) {
      console.log(error);

      return initialValue;
    }
  });

  const setValue: Dispatch<SetAction<S>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      store.setItem(prefix(key), JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export function useLocalStorage<S> (key: string, initialValue: S) {
  return useStorage(key, initialValue, localStorage);
}

export function useSessionStorage<S> (key: string, initialValue: S) {
  return useStorage(key, initialValue, sessionStorage);
}
