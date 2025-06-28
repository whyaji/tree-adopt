import { JSX } from 'react';

import { TableHeadbar } from './table-headbar';
import { TablePaginationControls } from './table-pagination-control';

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
  elementsHeader,
  className,
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
  elementsHeader?: JSX.Element[];
  className?: string;
}) {
  return (
    <div className={className ?? 'flex flex-col w-full h-full relative'}>
      <div className="sticky top-0 z-10 bg-background">
        <TableHeadbar
          title={title}
          tempSearch={tempSearch}
          setTempSearch={setTempSearch}
          addUrl={addUrl}
          elementsHeader={elementsHeader}
        />
      </div>
      <div className="flex w-full flex-1 overflow-auto mb-2 mt-2">{table}</div>
      <div className="sticky bottom-0 z-10 bg-background">
        <TablePaginationControls
          page={page}
          setPage={setPage}
          totalPage={totalPage}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}
