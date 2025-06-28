import { useEffect, useState } from 'react';

import { FILTER_NAME } from '@/enum/filter-name.enum';
import { PaginationParams, PaginationParamsOptional } from '@/interface/pagination.interface';

export function usePaginationFilter<T>(
  defaultParams?: PaginationParamsOptional,
  listFilter?: FILTER_NAME[],
  defaultFilter?: Record<FILTER_NAME, string>
) {
  const [page, setPage] = useState(defaultParams?.page ?? 1);
  const [limit, setLimit] = useState(defaultParams?.limit ?? 10);
  const [search, setSearch] = useState(defaultParams?.search ?? '');
  const [filter, setFilter] = useState(defaultParams?.filter ?? '');
  const [withData, setWithData] = useState(defaultParams?.withData ?? '');
  const [sortBy, setSortBy] = useState(defaultParams?.sortBy ?? 'createdAt');
  const [order, setOrder] = useState(defaultParams?.order ?? 'desc');
  const [tempSearch, setTempSearch] = useState(defaultParams?.search ?? '');
  const [select, setSelect] = useState(defaultParams?.select ?? '');
  const [data, setData] = useState<T[]>([]);

  const defaultFilterValues =
    listFilter?.reduce(
      (acc, filterName) => {
        acc[filterName] = defaultFilter?.[filterName] ?? '';
        return acc;
      },
      {} as Record<FILTER_NAME, string>
    ) ?? ({} as Record<FILTER_NAME, string>);

  const [filterState, setFilterState] = useState<Record<FILTER_NAME, string>>(defaultFilterValues);
  const [tempFilterState, setTempFilterState] =
    useState<Record<FILTER_NAME, string>>(defaultFilterValues);

  const onOpenFilter = () => {
    setTempFilterState(filterState);
  };

  const handleFilterChange = (filterName: FILTER_NAME, value: string) => {
    setTempFilterState((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilter = () => {
    setTempFilterState(defaultFilterValues);
  };

  const handleApplyFilter = (filterName?: FILTER_NAME, value?: string) => {
    const isWithFilterChange = filterName !== undefined && value !== undefined;
    if (isWithFilterChange) {
      handleFilterChange(filterName, value);
    }
    const newFilterState = isWithFilterChange
      ? {
          ...filterState,
          ...tempFilterState,
          ...{
            [filterName]: value,
          },
        }
      : { ...filterState, ...tempFilterState };
    setFilterState(newFilterState);
    const filterString =
      listFilter?.reduce((acc, filterName) => {
        const value = newFilterState[filterName];
        if (value) {
          if (value === 'null') {
            acc += `${filterName}::null;`;
          } else if (value === 'notnull') {
            acc += `${filterName}::notnull;`;
          } else {
            acc += `${filterName}:${value};`;
          }
        }
        return acc;
      }, '') || '';
    setFilter(filterString ? filterString.slice(0, -1) : ''); // remove trailing semicolon
    setPage(1);
  };

  const handleResetFilter = () => {
    resetFilter();
    setFilter('');
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(tempSearch);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [tempSearch]);

  const paginationParams: PaginationParams = {
    search,
    page,
    limit,
    filter,
    withData,
    sortBy,
    order,
    select,
  };

  return {
    page,
    setPage,
    limit,
    setLimit,
    search,
    tempSearch,
    setTempSearch,
    filter,
    setFilter,
    withData,
    setWithData,
    sortBy,
    setSortBy,
    order,
    setOrder,
    select,
    setSelect,
    paginationParams,
    data,
    setData,
    filterState,
    tempFilterState,
    handleFilterChange,
    handleApplyFilter,
    handleResetFilter,
    onOpenFilter,
  };
}
