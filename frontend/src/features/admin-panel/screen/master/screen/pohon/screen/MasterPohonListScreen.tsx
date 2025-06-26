import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getMasterTrees } from '@/lib/api/masterTreeApi';
import { MasterTreeType } from '@/types/masterTree.type';

import { MasterPohonTable } from '../components/master-pohon-table/MasterPohonTable';

export function MasterPohonListScreen() {
  const { page, setPage, limit, setLimit, tempSearch, setTempSearch, paginationParams } =
    usePaginationFilter({
      withData: 'masterLocalTree',
      sortBy: 'id',
      order: 'desc',
    });

  const { isPending, error, data } = useQuery({
    queryKey: ['get-master-tree', paginationParams],
    queryFn: () => getMasterTrees(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <TableData
      title="Master Pohon"
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={page}
      setPage={setPage}
      totalPage={totalPage}
      limit={limit}
      setLimit={setLimit}
      addUrl="/admin/master/pohon/add-master-tree"
      table={<MasterPohonTable data={data?.data as MasterTreeType[]} isPending={isPending} />}
    />
  );
}
