import { TableHeadbar } from './table-headbar';
import { TablePaginationControls } from './table-pagination-control';
import { Card } from './ui/card';

export function TableData({
  title,
  tempSearch,
  setTempSearch,
  page,
  setPage,
  totalPage,
  limit,
  setLimit,
  addUrl,
  table,
}: {
  title: string;
  tempSearch: string;
  setTempSearch: (val: string) => void;
  page: number;
  setPage: (page: number) => void;
  totalPage: number;
  limit: number;
  setLimit: (limit: number) => void;
  addUrl?: string;
  table: React.ReactNode;
}) {
  return (
    <Card className="p-4 m-auto mt-6 max-w-7xl">
      <TableHeadbar
        title={title}
        tempSearch={tempSearch}
        setTempSearch={setTempSearch}
        addUrl={addUrl}
      />
      {table}
      <TablePaginationControls
        page={page}
        setPage={setPage}
        totalPage={totalPage}
        limit={limit}
        setLimit={setLimit}
      />
    </Card>
  );
}
