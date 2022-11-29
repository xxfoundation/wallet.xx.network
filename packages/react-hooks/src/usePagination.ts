// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useMemo, useState } from 'react';

import { useToggle } from './useToggle';

export interface Pagination<T> {
  currentPage: number;
  goTo: (page: number) => void;
  items: T[] | undefined;
  next?: () => void;
  previous?: () => void;
  reset: () => void;
  maxPage: number;
  enabled: boolean;
  toggle: () => void;
}

interface PaginationOptions {
  perPage?: number;
}

const defaults = {
  perPage: 10
};

export type UsePagination = <T>(data?: T[], options?: PaginationOptions) => Pagination<T>;

export const usePagination: UsePagination = (
  data,
  { perPage = defaults.perPage } = defaults
) => {
  const [enabled, toggle] = useToggle(true);
  const length = data?.length ?? 0;
  const maxPage = Math.ceil(length / perPage) || 1;
  const [currentPage, setCurrentPage] = useState(1);
  const begin = (currentPage - 1) * perPage;
  const end = begin + perPage;

  const items = useMemo(
    () => enabled ? data?.slice(Math.max(begin, 0), end) : data,
    [begin, data, enabled, end]
  );

  const next = useCallback(() => {
    setCurrentPage((page: number) => Math.min(page + 1, maxPage));
  }, [maxPage]);

  const previous = useCallback(() => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  }, []);

  const goTo = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, page);

      setCurrentPage(Math.min(pageNumber, page));
    },
    []
  );

  const reset = useCallback(() => setCurrentPage(1), []);

  const hasNext = currentPage !== maxPage;
  const hasPrevious = currentPage !== 1;

  return {
    currentPage,
    enabled,
    goTo,
    items,
    maxPage,
    next: hasNext ? next : undefined,
    previous: hasPrevious ? previous : undefined,
    reset,
    toggle
  };
};
