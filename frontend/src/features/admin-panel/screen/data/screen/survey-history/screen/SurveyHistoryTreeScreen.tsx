import { useQuery } from '@tanstack/react-query';

import { TableData } from '@/components/table-data';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { getSurveyHistories } from '@/lib/api/surveyHistoryApi';
import { Route } from '@/routes/_authenticated_admin/admin/data/pohon/$treeId/survey-history';
import { SurveyHistoryType } from '@/types/surveyHistory.type';

import { SurveyHistoryTable } from '../components/survey-history-table/SurveyHistoryTable';

export function SurveyHistoryTreeScreen() {
  const { tree } = Route.useLoaderData();

  const { setPage, setLimit, tempSearch, setTempSearch, paginationParams } = usePaginationFilter({
    filter: `treeId:${tree?.id}:eq`,
  });

  const { isPending, error, data } = useQuery({
    queryKey: ['get-survey-histories', paginationParams],
    queryFn: () => getSurveyHistories(paginationParams),
    enabled: tree !== null,
  });

  if (!tree) {
    return <div className="text-center">No Tree data available</div>;
  }

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
      addUrl={`/admin/data/pohon/${tree.id}/survey-history/add`}
      table={<SurveyHistoryTable data={data?.data as SurveyHistoryType[]} isPending={isPending} />}
    />
  );
}
