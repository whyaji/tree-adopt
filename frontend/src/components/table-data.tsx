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
  sticky = true,
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
  sticky?: boolean;
}) {
  return (
    <div className={className ?? 'flex flex-col w-full relative' + (sticky ? ' h-full' : '')}>
      <div className={'bg-background' + (sticky ? ' sticky top-0 z-10' : '')}>
        <TableHeadbar
          title={title}
          tempSearch={tempSearch}
          setTempSearch={setTempSearch}
          addUrl={addUrl}
          elementsHeader={elementsHeader}
        />
      </div>
      <div className="flex w-full flex-1 overflow-auto mb-2 mt-2">{table}</div>
      <div className={'bg-background' + (sticky ? ' sticky bottom-0 z-10' : '')}>
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
