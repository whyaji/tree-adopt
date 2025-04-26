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
import { TreeCategoryLabel } from '@/enum/treeCategory.enum';
import { deleteTree } from '@/lib/api/treeApi';
import { dateTimeFormat } from '@/lib/utils/dateTimeFormat';
import { SurveyHistoryType } from '@/types/surveyHistory.type';

export function SurveyHistoryTable({
  data,
  isPending,
}: {
  data?: SurveyHistoryType[];
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
            'Tanggal Survey',
            'Kategori Pohon',
            'Diameter',
            'Tinggi',
            'Serapan CO2',
            'Action',
          ].map((head) => (
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
            : data?.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>{survey.id}</TableCell>
                  <TableCell>{dateTimeFormat(survey.surveyDate, { dateOnly: true })}</TableCell>
                  <TableCell>{TreeCategoryLabel[survey.category]}</TableCell>
                  <TableCell>{survey.diameter} cm</TableCell>
                  <TableCell>{survey.height} cm</TableCell>
                  <TableCell>{survey.serapanCo2} kg</TableCell>
                  <TableCell>
                    <div className="flex flex-row gap-4">
                      <Button
                        variant="outline"
                        className="w-20"
                        onClick={() =>
                          navigate({
                            to: `/admin/data/pohon/${survey.treeId}/survey-history/${survey.id}/update`,
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
                            await deleteTree(String(survey.id));
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
