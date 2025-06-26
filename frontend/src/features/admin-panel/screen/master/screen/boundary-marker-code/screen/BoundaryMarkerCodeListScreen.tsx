import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getBoundaryMarkerCodes } from '@/lib/api/boundaryMarkerApi';
import { useUserStore } from '@/lib/stores/userStore';
import { BoundarymarkerCodeType } from '@/types/boundaryMarker.type';

import { BoundaryMarkerCodeTable } from '../components/boundary-marker-code-table/BoundaryMarkerCodeTable';

export function BoundaryMarkerCodeListScreen() {
  const user = useUserStore((state) => state.user);
  const { page, setPage, limit, setLimit, tempSearch, setTempSearch, paginationParams } =
    usePaginationFilter({
      withData: 'kelompokKomunitasId,marker',
      filter: user?.groupId ? `kelompokKomunitasId:${user.groupId}:eq` : undefined,
    });

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-boundary-marker-code', paginationParams],
    queryFn: () => getBoundaryMarkerCodes(paginationParams),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <TableData
      title="Master Kode Patok Batas"
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={page}
      setPage={setPage}
      totalPage={totalPage}
      limit={limit}
      setLimit={setLimit}
      addUrl="/admin/master/kode-patok-batas/add"
      table={
        <BoundaryMarkerCodeTable
          data={data?.data as BoundarymarkerCodeType[]}
          isPending={isPending}
          refetch={refetch}
        />
      }
    />
  );
}
