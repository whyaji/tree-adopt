import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { TablePaginationContent } from './table-pagination-content';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function TablePaginationControls({
  page,
  setPage,
  totalPage,
  limit,
  setLimit,
}: {
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
      {/* Items per page selector */}
      <div className="flex flex-row flex-1 items-center gap-2 md:gap-4">
        <h2 className="text-sm md:text-base">Items per page:</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-12 px-0 md:px-2">
              {limit}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-18">
            {[5, 10, 20, 50, 100].map((item) => (
              <DropdownMenuItem key={item} onClick={() => setLimit(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Pagination controls */}
      <Pagination className="flex flex-row items-center w-full md:w-auto justify-end">
        <PaginationContent className="w-24 md:w-30">
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage(page - 1)}
                className="px-2 md:px-3"
              />
            </PaginationItem>
          )}
        </PaginationContent>
        <TablePaginationContent page={page} totalPage={totalPage} setPage={setPage} />
        <PaginationContent className="w-24 md:w-30 justify-end">
          {page < totalPage && (
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage(page + 1)} className="px-2 md:px-3" />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
