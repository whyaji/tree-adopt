import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from '@/components/ui/pagination';

export function TablePaginationContent({
  page,
  totalPage,
  setPage,
}: {
  page: number;
  totalPage: number;
  setPage: (page: number) => void;
}) {
  const items = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPage, startPage + maxPagesToShow - 1);

  if (startPage > 1) {
    items.push(
      <PaginationItem key={1}>
        <PaginationLink href="#" onClick={() => setPage(1)}>
          1
        </PaginationLink>
      </PaginationItem>
    );
    if (startPage > 2)
      items.push(
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>
      );
  }

  for (let i = startPage; i <= endPage; i++) {
    items.push(
      <PaginationItem key={i}>
        <PaginationLink href="#" isActive={i === page} onClick={() => setPage(i)}>
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  }

  if (endPage < totalPage) {
    if (endPage < totalPage - 1)
      items.push(
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>
      );
    items.push(
      <PaginationItem key={totalPage}>
        <PaginationLink href="#" onClick={() => setPage(totalPage)}>
          {totalPage}
        </PaginationLink>
      </PaginationItem>
    );
  }

  return <PaginationContent>{items}</PaginationContent>;
}
