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
import { deleteTree } from '@/lib/api/treeApi';
import { TreeType } from '@/types/tree.type';

export function PohonTable({ data, isPending }: { data?: TreeType[]; isPending: boolean }) {
  const navigate = useNavigate();

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'Action'].map((head) => (
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
          : data?.map((tree) => (
              <TableRow key={tree.id}>
                <TableCell>{tree.id}</TableCell>
                <TableCell className="flex flex-row gap-4">
                  <Button
                    variant="outline"
                    className="w-20"
                    onClick={() =>
                      navigate({
                        to: `/admin/data/pohon/update/${tree.id}`,
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
                        await deleteTree(String(tree.id));
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
                </TableCell>
              </TableRow>
            ))}
      </TableBody>
    </Table>
  );
}
