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
import { deleteMasterTreeLocal } from '@/lib/api/masterTreeApi';
import { MasterLocalTreeType } from '@/types/masterTree.type';

export function MasterLocalTreeTable({
  data,
  isPending,
  refetch,
}: {
  data?: MasterLocalTreeType[];
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
          {['ID', 'Local Name', 'Latin Name', 'Action'].map((head) => (
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
          : data?.map((masterLocalTree) => (
              <TableRow key={masterLocalTree.id}>
                <TableCell>{masterLocalTree.id}</TableCell>
                <TableCell>{masterLocalTree.localName}</TableCell>
                <TableCell>{masterLocalTree.masterTree?.latinName}</TableCell>
                <TableCell className="flex flex-row gap-4">
                  <Button
                    variant="outline"
                    className="w-20"
                    onClick={() =>
                      navigate({
                        to: `/admin/master/pohon-lokal/update/${masterLocalTree.id}`,
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
                        await deleteMasterTreeLocal(String(masterLocalTree.id));
                        refetch?.();
                        toast.success('Master pohon lokal deleted successfully');
                      } catch (error) {
                        console.error(error);
                        toast.error('Failed to delete master pohon lokal');
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
