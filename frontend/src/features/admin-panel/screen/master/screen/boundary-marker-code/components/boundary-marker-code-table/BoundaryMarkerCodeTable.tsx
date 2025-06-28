import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
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
import { deleteBoundaryMarkerCodeById } from '@/lib/api/boundaryMarkerApi';
import { BoundarymarkerCodeType } from '@/types/boundaryMarker.type';

export function BoundaryMarkerCodeTable({
  data,
  isPending,
  refetch,
}: {
  data?: BoundarymarkerCodeType[];
  isPending: boolean;
  refetch?: () => void;
}) {
  const navigate = useNavigate();

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-background">
        <TableRow>
          {['ID', 'Kode', 'Kelompok Komunitas', 'Marker', 'Action'].map((head) => (
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
          : data?.map((boundaryMarkerCode) => (
              <TableRow key={boundaryMarkerCode.id}>
                <TableCell>{boundaryMarkerCode.id}</TableCell>
                <TableCell>{boundaryMarkerCode.code}</TableCell>
                <TableCell>{boundaryMarkerCode.kelompokKomunitas?.name ?? '-'}</TableCell>
                <TableCell>{boundaryMarkerCode.marker?.name ?? '-'}</TableCell>
                <TableCell className="flex flex-row gap-4">
                  <Button
                    variant="outline"
                    className="w-20"
                    onClick={() =>
                      navigate({
                        to: `/admin/master/kode-patok-batas/${boundaryMarkerCode.id}/update`,
                      })
                    }>
                    Edit
                  </Button>
                  <ConfirmationDialog
                    title="Apakah anda yakin untuk menghapus?"
                    message="Data yang dihapus tidak dapat dikembalikan."
                    confirmText="Delete"
                    onConfirm={async () => {
                      try {
                        await deleteBoundaryMarkerCodeById(String(boundaryMarkerCode.id));
                        refetch?.();
                        toast.success('Master kode patok batas deleted successfully');
                      } catch (error) {
                        console.error(error);
                        toast.error('Failed to delete master kode patok batas');
                      }
                    }}
                    confirmVarriant="destructive"
                    triggerButton={
                      <Button variant="destructive" className="w-20">
                        Delete
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
