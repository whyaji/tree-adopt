import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getBoundaryMarkerCheckHistories } from '@/lib/api/boundaryMarkerApi.js';
import { Route } from '@/routes/_authenticated_admin/admin/data/patok-batas/$boundaryMarkerId/check-history';
import { CheckBmHistoryType } from '@/types/boundaryMarker.type.js';

import { FormCheckBmHistory } from '../components/check-bm-history-table/CheckBmHistoryTable.js';

export function CheckBmHistoryListScreen() {
  const { boundaryMarker } = Route.useLoaderData();

  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    filter: `boundaryMarkerId:${boundaryMarker?.id}:eq`,
  });

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-survey-histories', paginationParams],
    queryFn: () => getBoundaryMarkerCheckHistories(paginationParams),
    enabled: boundaryMarker !== null,
  });

  if (!boundaryMarker) {
    return <div className="text-center">No boundary marker data available</div>;
  }

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  return (
    <TableData
      title={`Check History for ${boundaryMarker?.code}`}
      tempSearch={tempSearch}
      setTempSearch={setTempSearch}
      page={paginationParams.page}
      setPage={setPage}
      totalPage={totalPage}
      limit={paginationParams.limit}
      setLimit={setLimit}
      addUrl={`/admin/data/patok-batas/${boundaryMarker.id}/check-history/add`}
      table={
        <FormCheckBmHistory
          data={data?.data as CheckBmHistoryType[]}
          isPending={isPending}
          refetch={refetch}
        />
      }
    />
  );
}
