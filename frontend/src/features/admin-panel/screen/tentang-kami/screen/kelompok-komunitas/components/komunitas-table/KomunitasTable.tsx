import { useNavigate } from '@tanstack/react-router';
import { ActivityIcon, Eye, Pen, Trash } from 'lucide-react';
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
import { PERMISSION } from '@/enum/permission.enum';
import { deleteKelompokKomunitas } from '@/lib/api/kelompokKomunitasApi';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermission } from '@/lib/utils/permissions';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

export function KomunitasTable({
  data,
  isPending,
}: {
  data?: KelompokKomunitasType[];
  isPending: boolean;
}) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  const isEditor = checkPermission(user?.permissions ?? [], [
    PERMISSION.COMUNITY_GROUP_UPDATE_LEVEL_GLOBAL,
  ]);

  const isEditorGroup = checkPermission(user?.permissions ?? [], [
    PERMISSION.COMUNITY_GROUP_UPDATE_LEVEL_GROUP,
  ]);

  const isActivityViewer = checkPermission(user?.permissions ?? [], [
    PERMISSION.COMUNITY_GROUP_ACTIVITY_VIEW,
  ]);

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-background">
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
                    onClick={() =>
                      navigate({
                        to: `/admin/tentang-kami/kelompok-komunitas/${komunitas.id}`,
                      })
                    }>
                    <Eye className="h-4 w-4" />
                    Detail
                  </Button>
                  {isActivityViewer && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate({
                          to: `/admin/tentang-kami/kelompok-komunitas/${komunitas.id}/aktivitas`,
                        })
                      }>
                      <ActivityIcon className="h-4 w-4" />
                      Aktivitas
                    </Button>
                  )}
                  {(isEditor || (isEditorGroup && komunitas.id === user?.groupId)) && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate({
                          to: `/admin/tentang-kami/kelompok-komunitas/${komunitas.id}/update-komunitas`,
                        })
                      }>
                      <Pen className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                  {isEditor && (
                    <ConfirmationDialog
                      title="Apakah anda yakin untuk menghapus?"
                      message="Data yang dihapus tidak dapat dikembalikan."
                      confirmText="Delete"
                      onConfirm={async () => {
                        try {
                          await deleteKelompokKomunitas(String(komunitas.id));
                          window.location.reload();
                        } catch (error) {
                          console.error(error);
                          toast.error('Failed to delete komunitas');
                        }
                      }}
                      confirmVarriant="destructive"
                      triggerButton={
                        <Button variant="destructive" className="w-20">
                          <Trash className="h-4 w-4" />
                          Delete
                        </Button>
                      }
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
