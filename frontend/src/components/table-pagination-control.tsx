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
    <div className="flex flex-col items-center gap-4">
      <Pagination className="flex flex-row items-center justify-between">
        <PaginationContent className="w-40 justify-start">
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href="#" onClick={() => setPage(page - 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
        <TablePaginationContent page={page} totalPage={totalPage} setPage={setPage} />
        <PaginationContent className="w-40 justify-end">
          {page < totalPage && (
            <PaginationItem>
              <PaginationNext href="#" onClick={() => setPage(page + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      <div className="flex flex-row gap-4 items-center">
        <h2>Items per page:</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-12">
              {limit}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-18">
            {[10, 20, 50, 100].map((item) => (
              <DropdownMenuItem key={item} onClick={() => setLimit(item)}>
                {item}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
