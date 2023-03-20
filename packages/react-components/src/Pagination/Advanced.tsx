// Copyright 2017-2023 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import range from 'lodash.range';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import Button from '../Button';
import { useTranslation } from '../translate';

const AdvancedControlsContainer = styled.nav`
  display: flex;
  justify-content: space-between;

  .description {
    padding: 0.7rem;
    line-height: normal;
  }

  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;

    & li { 
      margin: 0;
      padding: 0;
      text-indent: 0;
      list-style-type: 0;
    }
  }
`;

const ELLIPSIS = '...';

const pageRangeWithEllipsis = (currentPage: number, maxPage: number) => {
  const delta = 3;
  const min = currentPage - delta;
  const max = currentPage + delta + 1;

  const shownPages = range(1, maxPage + 1).filter(
    (i) => i === 1 || i === maxPage || (i >= min && i < max)
  );

  return shownPages.reduce((acc, page, index, pages) => {
    acc.push(page);
    const next = pages[index + 1];

    if (next && next - page > 1) {
      acc.push(ELLIPSIS);
    }

    return acc;
  }, [] as Array<number | typeof ELLIPSIS>);
};

type Props = {
  currentPage: number;
  goTo: (page: number) => void;
  enabled?: boolean;
  next?: () => void;
  previous?: () => void;
  maxPage: number;
  toggle?: () => void
}

const PaginationAdvanced = ({ currentPage, enabled, goTo, maxPage, next, previous, toggle }: Props): React.ReactElement<Props> | null => {
  const { t } = useTranslation();

  const _goTo = useCallback((page: number) => () => goTo(page), [goTo]);

  const numberButtons = useMemo(
    () => pageRangeWithEllipsis(currentPage, maxPage).map((page, index) =>
      page === ELLIPSIS
        ? (
          <li
            className='page-item'
            key={`${page}${index}`}
          >
            <Button
              className='page-link'
              isDisabled={true}
            >
              {page}
            </Button>
          </li>
        )
        : (
          <li
            className={`page-item ${page === currentPage ? 'active' : ''}`}
            key={page}
          >
            <Button
              className='page-link'
              isSelected={page === currentPage}
              onClick={_goTo(page)}
            >
              {page}
            </Button>
          </li>
        )
    ), [_goTo, currentPage, maxPage]);

  return maxPage === 0
    ? null
    : (
      <AdvancedControlsContainer>

        <p className='description'>
          {enabled
            ? t(
              'Displaying page {{page}} of {{max}}',
              { max: maxPage, page: currentPage }
            )
            : t('Displaying all')}
        </p>
        <ul className='pagination'>
          {enabled && (
            <>
              <li className='page-item'>
                <Button
                  className='page-link'
                  isDisabled={!previous}
                  onClick={previous}
                >
                  {t('Previous')}
                </Button>
              </li>
              {numberButtons}
              <li className='page-item'>
                <Button
                  className='page-link'
                  isDisabled={!next}
                  onClick={next}
                >
                  {t('Next')}
                </Button>
              </li>
            </>
          )}
          {toggle && (
            <li>
              <Button
                className='page-link'
                onClick={toggle}
              >
                {enabled ? t('View all') : t('View paginated')}
              </Button>
            </li>
          )}
        </ul>
      </AdvancedControlsContainer>
    );
};

export default PaginationAdvanced;
