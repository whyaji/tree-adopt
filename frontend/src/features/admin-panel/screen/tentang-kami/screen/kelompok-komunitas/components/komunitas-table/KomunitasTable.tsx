import { useNavigate } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

export function KomunitasTable({
  data,
  isPending,
}: {
  data?: KelompokKomunitasType[];
  isPending: boolean;
}) {
  const navigate = useNavigate();

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  return (
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
          : data?.map((komunitas) => (
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
                        to: `/admin/tentang-kami/kelompok-komunitas/update-komunitas/${komunitas.id}`,
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
  );
}
