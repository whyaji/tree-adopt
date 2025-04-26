import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

import { KomunitasTable } from '../components/komunitas-table/KomunitasTable';

export function KelompokKomunitasListScreen() {
  const { page, setPage, limit, setLimit, search, tempSearch, setTempSearch } =
    usePaginationFilter();

  const { isPending, error, data } = useQuery({
    queryKey: ['get-komunitas', search, page, limit],
    queryFn: () => getKelompokKomunitas({ search, page, limit }),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

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
      addUrl="/admin/tentang-kami/kelompok-komunitas/add-komunitas"
      table={<KomunitasTable data={data?.data as KelompokKomunitasType[]} isPending={isPending} />}
    />
  );
}
