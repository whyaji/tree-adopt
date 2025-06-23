import { useNavigate } from '@tanstack/react-router';
import { Eye, FileText, Pen, Trash } from 'lucide-react';
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
import { deleteBoundaryMarkerById } from '@/lib/api/boundaryMarkerApi';
import { BoundaryMarkerType } from '@/types/boundaryMarker.type';

export function BoundaryMarkerTable({
  data,
  isPending,
  refetch,
}: {
  data?: BoundaryMarkerType[];
  isPending: boolean;
  refetch?: () => void;
}) {
  const navigate = useNavigate();

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'Kode', 'Komunitas', 'Checker', 'Action'].map((head) => (
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
          : data?.map((boundaryMarker) => (
              <TableRow key={boundaryMarker.id}>
                <TableCell>{boundaryMarker.id}</TableCell>
                <TableCell>{boundaryMarker.code}</TableCell>
                <TableCell>{boundaryMarker.kelompokKomunitas?.name ?? '-'}</TableCell>
                <TableCell>{boundaryMarker.checker?.name ?? '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate({
                          to: `/admin/data/patok-batas/${boundaryMarker.id}`,
                        })
                      }>
                      <Eye className="h-4 w-4" />
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      disabled={boundaryMarker.checkerId === null}
                      onClick={() =>
                        navigate({
                          to: `/admin/data/patok-batas/${boundaryMarker.id}/check-history`,
                        })
                      }>
                      <FileText className="h-4 w-4" />
                      Check
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate({
                          to: `/admin/data/patok-batas/${boundaryMarker.id}/update`,
                        })
                      }>
                      <Pen className="h-4 w-4" />
                      Edit
                    </Button>
                    <ConfirmationDialog
                      title="Apakah anda yakin untuk menghapus?"
                      message="Data yang dihapus tidak dapat dikembalikan."
                      confirmText="Delete"
                      onConfirm={async () => {
                        try {
                          await deleteBoundaryMarkerById(String(boundaryMarker.id));
                          refetch?.();
                        } catch (error) {
                          console.error(error);
                          toast.error('Failed to delete patok batas');
                        }
                      }}
                      confirmVarriant="destructive"
                      triggerButton={
                        <Button variant="destructive">
                          <Trash className="h-4 w-4" />
                          Delete
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
