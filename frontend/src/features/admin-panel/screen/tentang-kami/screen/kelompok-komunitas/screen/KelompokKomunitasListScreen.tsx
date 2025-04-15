import { useQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteKelompokKomunitas, getKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';

export function KelompokKomunitasListScreen() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [tempSearch, setTempSearch] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(tempSearch);
      setPage(1);
    }, 500);
    return () => clearTimeout(timeout);
  }, [tempSearch]);

  const { isPending, error, data } = useQuery({
    queryKey: ['get-komunitas', search, page, limit],
    queryFn: () => getKelompokKomunitas(search, page, limit),
  });

  const totalPage = data?.totalPage ?? 0;

  if (error) return <div>Error: {error.message}</div>;

  const renderPaginationItems = () => {
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
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink href="#" onClick={() => setPage(i)} isActive={i === page}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPage) {
      if (endPage < totalPage - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPage}>
          <PaginationLink href="#" onClick={() => setPage(totalPage)}>
            {totalPage}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Card className="p-4 m-auto mt-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <h1>List of Komunitas</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate({ to: '/tentang-kami/kelompok-komunitas/list-komunitas/add-komunitas' })
            }>
            +
          </Button>
          <Input
            className="w-100"
            value={tempSearch}
            onChange={(e) => setTempSearch(e.target.value)}
            placeholder="Search"
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {[
              'ID',
              'Name',
              'Description',
              'No SK',
              'KUPS',
              'Program Unggulan',
              'Latitude',
              'Longitude',
              'Action',
            ].map((head) => (
              <TableHead key={head}>{head}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending
            ? Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 9 }).map((_, subIndex) => (
                    <TableHead key={subIndex}>
                      <Skeleton className="h-5" />
                    </TableHead>
                  ))}
                </TableRow>
              ))
            : data?.data.map((komunitas) => (
                <TableRow key={komunitas.id}>
                  <TableCell>{komunitas.id}</TableCell>
                  <TableCell>{komunitas.name}</TableCell>
                  <TableCell>
                    {komunitas.description.length > 50
                      ? `${komunitas.description.slice(0, 50)}...`
                      : komunitas.description}
                  </TableCell>
                  <TableCell>{komunitas.noSk}</TableCell>
                  <TableCell>{komunitas.kups}</TableCell>
                  <TableCell>{komunitas.programUnggulan}</TableCell>
                  <TableCell>{komunitas.latitude}</TableCell>
                  <TableCell>{komunitas.longitude}</TableCell>
                  <TableCell className="flex flex-row gap-4">
                    <Button
                      variant="outline"
                      className="w-20"
                      onClick={() =>
                        navigate({
                          to: `/tentang-kami/kelompok-komunitas/list-komunitas/update-komunitas/${komunitas.id}`,
                        })
                      }>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="w-20"
                      onClick={async () => {
                        await deleteKelompokKomunitas(String(komunitas.id));
                        window.location.reload();
                      }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
      <div className="flex flex-col items-center gap-4">
        <Pagination className="flex flex-row items-center justify-between">
          <PaginationContent className="w-40 justify-start">
            {page > 1 && (
              <PaginationItem>
                <PaginationPrevious href="#" onClick={() => setPage(Math.max(1, page - 1))} />
              </PaginationItem>
            )}
          </PaginationContent>
          <PaginationContent>{renderPaginationItems()}</PaginationContent>
          <PaginationContent className="w-40 justify-end">
            {page < totalPage && (
              <PaginationItem>
                <PaginationNext href="#" onClick={() => setPage(Math.min(totalPage, page + 1))} />
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
    </Card>
  );
}
