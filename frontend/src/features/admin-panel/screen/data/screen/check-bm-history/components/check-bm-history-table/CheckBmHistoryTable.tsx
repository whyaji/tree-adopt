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
import { getActionsLabelIsTrue, getConditionsLabelIsTrue } from '@/enum/actions-conditions.enum';
import { deleteBoundaryMarkerCheckHistoryById } from '@/lib/api/boundaryMarkerApi';
import { dateTimeFormat } from '@/lib/utils/dateTimeFormat';
import { CheckBmHistoryType } from '@/types/boundaryMarker.type';

export function FormCheckBmHistory({
  data,
  isPending,
  refetch,
}: {
  data?: CheckBmHistoryType[];
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
          {['ID', 'Tanggal Check', 'Kondisi', 'Aksi', 'Action'].map((head) => (
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
            : data?.map((checkBmHistory) => (
                <TableRow key={checkBmHistory.id}>
                  <TableCell>{checkBmHistory.id}</TableCell>
                  <TableCell>
                    {dateTimeFormat(checkBmHistory.checkDate, { dateOnly: true })},{' '}
                    {checkBmHistory.checkTime}
                  </TableCell>
                  <TableCell>
                    {getConditionsLabelIsTrue(checkBmHistory.conditions).map((condition, index) => (
                      <div key={condition}>
                        {index + 1}. {condition}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {getActionsLabelIsTrue(checkBmHistory.actions).map((action, index) => (
                      <div key={action}>
                        {index + 1}. {action}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-4">
                      <Button
                        variant="outline"
                        className="w-20"
                        onClick={() =>
                          navigate({
                            to: `/admin/data/patok-batas/${checkBmHistory.boundaryMarkerId}/check-history/${checkBmHistory.id}/update`,
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
                            await deleteBoundaryMarkerCheckHistoryById(String(checkBmHistory.id));
                            refetch?.();
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
