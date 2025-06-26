import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getMasterTreeLocals } from '@/lib/api/masterTreeApi';
import { MasterLocalTreeType } from '@/types/masterTree.type';

import { MasterLocalTreeTable } from '../components/master-local-tree-table/MasterLocalTreeTable';

export function MasterLocalTreeListScreen() {
  const { page, setPage, limit, setLimit, tempSearch, setTempSearch, paginationParams } =
    usePaginationFilter({
      withData: 'masterTreeId',
      sortBy: 'id',
      order: 'desc',
    });

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-master-local-tree', paginationParams],
    queryFn: () => getMasterTreeLocals(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <TableData
      title="Master Pohon Lokal"
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={page}
      setPage={setPage}
      totalPage={totalPage}
      limit={limit}
      setLimit={setLimit}
      addUrl="/admin/master/pohon-lokal/add"
      table={
        <MasterLocalTreeTable
          data={data?.data as MasterLocalTreeType[]}
          isPending={isPending}
          refetch={refetch}
        />
      }
    />
  );
}
