import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { PERMISSION } from '@/enum/permission.enum';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getGroupActivities } from '@/lib/api/groupActivityApi';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermission } from '@/lib/utils/permissions';
import { Route } from '@/routes/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/$kelompokKomunitasId/aktivitas';
import { GroupActivityType } from '@/types/groupActivity.type';

import { GroupActivityTable } from '../components/group-activity-table/GroupActivityTable';

export function GroupActivityListScreen() {
  const { kelompokKomunitas } = Route.useLoaderData();
  const user = useUserStore((state) => state.user);

  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    filter: `kelompokKomunitasId:${kelompokKomunitas?.id}:eq`,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ['get-group-activities', paginationParams],
    queryFn: () => getGroupActivities(paginationParams),
    enabled: kelompokKomunitas !== null,
  });

  if (!kelompokKomunitas) {
    return <div className="text-center">No group data available</div>;
  }

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  const isCreator = checkPermission(user?.permissions ?? [], [
    PERMISSION.COMUNITY_GROUP_ACTIVITY_CREATE_LEVEL_GLOBAL,
    PERMISSION.COMUNITY_GROUP_ACTIVITY_CREATE_LEVEL_GROUP,
  ]);

  return (
    <TableData
      title={`Aktifitas ${kelompokKomunitas?.name}`}
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={paginationParams.page}
      setPage={setPage}
      totalPage={totalPage}
      limit={paginationParams.limit}
      setLimit={setLimit}
      addUrl={
        isCreator
          ? `/admin/tentang-kami/kelompok-komunitas/${kelompokKomunitas.id}/aktivitas/add`
          : undefined
      }
      table={<GroupActivityTable data={data?.data as GroupActivityType[]} isPending={isPending} />}
    />
  );
}
