import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getUsers } from '@/lib/api/userApi';
import { UserType } from '@/types/user.type';

import { UserTable } from '../components/user-table/UserTable';

export function UserListScreen() {
  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    sortBy: 'id',
    order: 'desc',
  });

  const { isPending, error, data } = useQuery({
    queryKey: ['get-user', paginationParams],
    queryFn: () => getUsers(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <TableData
      title="Pohon"
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={paginationParams.page}
      setPage={setPage}
      totalPage={totalPage}
      limit={paginationParams.limit}
      setLimit={setLimit}
      addUrl="/admin/config/user/add"
      table={<UserTable data={data?.data as UserType[]} isPending={isPending} />}
    />
  );
}
