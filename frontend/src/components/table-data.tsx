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
  infiniteScrollMobile,
  elementsHeader,
  className,
  sticky = true,
  withPadding = true,
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
  infiniteScrollMobile?: React.ReactNode;
  elementsHeader?: JSX.Element[];
  className?: string;
  sticky?: boolean;
  withPadding?: boolean;
}) {
  return (
    <div
      className={
        className ??
        'flex flex-col w-full relative' + (sticky ? ' h-full' : '') + (withPadding ? ' p-4' : '')
      }>
      <div className={'bg-background' + (sticky ? ' sticky top-0 z-10' : '')}>
        <TableHeadbar
          title={title}
          tempSearch={tempSearch}
          setTempSearch={setTempSearch}
          addUrl={addUrl}
          elementsHeader={elementsHeader}
        />
      </div>
      <div
        className={
          (infiniteScrollMobile !== undefined ? 'hidden sm:flex' : 'flex') +
          ' w-full flex-1 overflow-auto mb-2 mt-2'
        }>
        {table}
      </div>
      {infiniteScrollMobile && (
        <div className="sm:hidden flex w-full flex-1 overflow-auto mt-2">
          {infiniteScrollMobile}
        </div>
      )}
      <div
        className={
          (infiniteScrollMobile !== undefined ? 'hidden sm:block ' : '') +
          'bg-background' +
          (sticky ? ' sticky bottom-0 z-10' : '')
        }>
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
