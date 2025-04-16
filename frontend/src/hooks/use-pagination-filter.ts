import { useEffect, useState } from 'react';

export function usePaginationFilter() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [tempSearch, setTempSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(tempSearch);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [tempSearch]);

  return {
    page,
    setPage,
    limit,
    setLimit,
    search,
    tempSearch,
    setTempSearch,
  };
}
