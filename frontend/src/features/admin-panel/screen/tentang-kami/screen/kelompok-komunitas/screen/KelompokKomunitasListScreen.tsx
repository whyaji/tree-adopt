import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { PERMISSION } from '@/enum/permission.enum';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermission } from '@/lib/utils/permissions';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

import { KomunitasTable } from '../components/komunitas-table/KomunitasTable';

export function KelompokKomunitasListScreen() {
  const user = useUserStore((state) => state.user);
  const { page, setPage, limit, setLimit, search, tempSearch, setTempSearch } = usePaginationFilter(
    {
      filter: user?.permissions?.includes(PERMISSION.COMUNITY_GROUP_VIEW_LEVEL_GROUP)
        ? `id:${user?.groupId}:eq`
        : undefined,
    }
  );

  const { isPending, error, data } = useQuery({
    queryKey: ['get-komunitas', search, page, limit],
    queryFn: () => getKelompokKomunitas({ search, page, limit }),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  const isCreator = checkPermission(user?.permissions ?? [], [PERMISSION.COMUNITY_GROUP_CREATE]);

  return (
    <TableData
      title="Kelompok Komunitas"
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={page}
      setPage={setPage}
      totalPage={totalPage}
      limit={limit}
      setLimit={setLimit}
      addUrl={isCreator ? '/admin/tentang-kami/kelompok-komunitas/add-komunitas' : undefined}
      table={<KomunitasTable data={data?.data as KelompokKomunitasType[]} isPending={isPending} />}
    />
  );
}
