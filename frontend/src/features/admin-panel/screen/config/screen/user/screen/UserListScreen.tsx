import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { PERMISSION } from '@/enum/permission.enum';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getUsers } from '@/lib/api/userApi';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermission } from '@/lib/utils/permissions';
import { UserType } from '@/types/user.type';

import { UserTable } from '../components/user-table/UserTable';

export function UserListScreen() {
  const user = useUserStore((state) => state.user);
  const isGlobalAdmin = checkPermission(user?.permissions ?? [], [
    PERMISSION.USER_MANAGEMENT_CREATE_LEVEL_GLOBAL,
    PERMISSION.USER_MANAGEMENT_UPDATE_LEVEL_GLOBAL,
  ]);
  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    sortBy: 'id',
    order: 'desc',
    withData: 'roles',
    filter: isGlobalAdmin ? undefined : `groupId:${user?.groupId}`,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ['get-user', paginationParams],
    queryFn: () => getUsers(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  const createPermission = checkPermission(user?.permissions ?? [], [
    PERMISSION.USER_MANAGEMENT_CREATE_LEVEL_GLOBAL,
    PERMISSION.USER_MANAGEMENT_CREATE_LEVEL_GROUP,
  ]);

  const isEditor = checkPermission(user?.permissions ?? [], [
    PERMISSION.USER_MANAGEMENT_UPDATE_LEVEL_GLOBAL,
    PERMISSION.USER_MANAGEMENT_UPDATE_LEVEL_GROUPT,
  ]);

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
