import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getTrees } from '@/lib/api/treeApi';
import { TreeType } from '@/types/tree.type';

import { PohonTable } from '../components/pohon-table/PohonTable';

export function PohonListScreen() {
  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    withData: 'masterTreeId,kelompokKomunitasId,adopter,adopter.userId,survey,survey.userId',
  });

  const { isPending, error, data } = useQuery({
    queryKey: ['get-tree', paginationParams],
    queryFn: () => getTrees(paginationParams),
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
      addUrl="/admin/data/pohon/add"
      table={<PohonTable data={data?.data as TreeType[]} isPending={isPending} />}
    />
  );
}
