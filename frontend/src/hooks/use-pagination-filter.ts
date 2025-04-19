import { useEffect, useState } from 'react';

import { PaginationParams } from '@/interface/pagination.interface';

export function usePaginationFilter(defaultParams?: {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  withData?: string;
  sortBy?: string;
  order?: string;
}) {
  const [page, setPage] = useState(defaultParams?.page ?? 1);
  const [limit, setLimit] = useState(defaultParams?.limit ?? 10);
  const [search, setSearch] = useState(defaultParams?.search ?? '');
  const [filter, setFilter] = useState(defaultParams?.filter ?? '');
  const [withData, setWithData] = useState(defaultParams?.withData ?? '');
  const [sortBy, setSortBy] = useState(defaultParams?.sortBy ?? 'createdAt');
  const [order, setOrder] = useState(defaultParams?.order ?? 'desc');
  const [tempSearch, setTempSearch] = useState(defaultParams?.search ?? '');

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
    paginationParams,
  };
}
