import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getBoundaryMarkers } from '@/lib/api/boundaryMarkerApi';
import { useUserStore } from '@/lib/stores/userStore';
import { BoundaryMarkerType } from '@/types/boundaryMarker.type';

import { BoundaryMarkerTable } from '../components/boundary-marker-table/BoundaryMarkerTable';

export function BoundaryMarkerListScreen() {
  const user = useUserStore((state) => state.user);
  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    withData: 'kelompokKomunitasId,checkerId',
    sortBy: 'id',
    order: 'desc',
    filter: user?.groupId ? `kelompokKomunitasId:${user.groupId}:eq` : undefined,
  });

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-boundary-markers', paginationParams],
    queryFn: () => getBoundaryMarkers(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <TableData
      title="Patok Batas"
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={paginationParams.page}
      setPage={setPage}
      totalPage={totalPage}
      limit={paginationParams.limit}
      setLimit={setLimit}
      addUrl="/admin/data/patok-batas/add"
      table={
        <BoundaryMarkerTable
          data={data?.data as BoundaryMarkerType[]}
          isPending={isPending}
          refetch={refetch}
        />
      }
    />
  );
}
