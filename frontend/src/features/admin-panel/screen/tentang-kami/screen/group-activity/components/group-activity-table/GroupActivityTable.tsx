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
import { PERMISSION } from '@/enum/permission.enum';
import { deleteTree } from '@/lib/api/treeApi';
import { useUserStore } from '@/lib/stores/userStore';
import { toDbDate } from '@/lib/utils/dateTimeFormat';
import { checkPermission } from '@/lib/utils/permissions';
import { GroupActivityType } from '@/types/groupActivity.type';

export function GroupActivityTable({
  data,
  isPending,
}: {
  data?: GroupActivityType[];
  isPending: boolean;
}) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  const isEditor =
    checkPermission(user?.permissions ?? [], [
      PERMISSION.COMUNITY_GROUP_ACTIVITY_UPDATE_LEVEL_GLOBAL,
    ]) ||
    (checkPermission(user?.permissions ?? [], [
      PERMISSION.COMUNITY_GROUP_ACTIVITY_UPDATE_LEVEL_GROUP,
    ]) &&
      user?.kelompokKomunitas?.id === data?.[0]?.kelompokKomunitasId);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'Judul', 'Tanggal Kegiatan', 'Action'].map((head) => (
            <TableHead key={head}>{head}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      {data && !isPending && data.length > 0 ? (
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
            : data?.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.id}</TableCell>
                  <TableCell>{activity.title}</TableCell>
                  <TableCell>
                    {toDbDate(activity.date, { fromFormat: 'YYYY-MM-DD', toFormat: 'D MMM YYYY' })},{' '}
                    {activity.time}
                  </TableCell>
                  <TableCell>
                    {isEditor && (
                      <div className="flex flex-row gap-4">
                        <Button
                          variant="outline"
                          className="w-20"
                          onClick={() =>
                            navigate({
                              to: `/admin/tentang-kami/kelompok-komunitas/${activity.kelompokKomunitasId}/aktivitas/${activity.id}/update`,
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
                              await deleteTree(String(activity.id));
                              window.location.reload();
                            } catch (error) {
                              console.error(error);
                              toast.error('Failed to delete komunitas');
                            }
                          }}
                          confirmVarriant="destructive"
                          triggerButton={
                            <Button variant="destructive" className="w-20">
                              Delete
                            </Button>
                          }
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      ) : (
        <TableBody>
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No data available
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  );
}
