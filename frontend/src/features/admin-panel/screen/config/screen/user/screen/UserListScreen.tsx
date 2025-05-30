import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getUsers } from '@/lib/api/userApi';
import { useUserStore } from '@/lib/stores/userStore';
import { UserType } from '@/types/user.type';

import { UserTable } from '../components/user-table/UserTable';

export function UserListScreen() {
  const user = useUserStore((state) => state.user);
  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    sortBy: 'id',
    order: 'desc',
    withData: 'roles',
  });

  const { isPending, error, data } = useQuery({
    queryKey: ['get-user', paginationParams],
    queryFn: () => getUsers(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  const createPermission =
    user?.permissions?.some((perm) =>
      ['user-management.create-level-group', 'user-management.create-level-global'].includes(perm)
    ) ?? false;

  const isEditor =
    user?.permissions?.some((perm) =>
      ['user-management.update-level-group', 'user-management.update-level-global'].includes(perm)
    ) ?? false;

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
      addUrl={createPermission ? '/admin/config/user/add' : undefined}
      table={
        <UserTable data={data?.data as UserType[]} isPending={isPending} isEditor={isEditor} />
      }
    />
  );
}
