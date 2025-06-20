import { useEffect, useState } from 'react';

import { PaginationParams, PaginationParamsOptional } from '@/interface/pagination.interface';

export function usePaginationFilter<T>(defaultParams?: PaginationParamsOptional) {
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
  };
}
