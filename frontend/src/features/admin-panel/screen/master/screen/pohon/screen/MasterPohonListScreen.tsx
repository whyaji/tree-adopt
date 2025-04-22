import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getMasterTrees } from '@/lib/api/masterTreeApi';
import { MasterTreeType } from '@/types/masterTree.type';

import { MasterPohonTable } from '../components/master-pohon-table/MasterPohonTable';

export function MasterPohonListScreen() {
  const { page, setPage, limit, setLimit, search, tempSearch, setTempSearch } =
    usePaginationFilter();

  const { isPending, error, data } = useQuery({
    queryKey: ['get-master-tree', search, page, limit],
    queryFn: () => getMasterTrees({ search, page, limit }),
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
