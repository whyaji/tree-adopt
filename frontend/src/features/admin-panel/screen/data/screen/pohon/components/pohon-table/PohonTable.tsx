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
import { LandTypeLabel } from '@/enum/landType.enum';
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
          {['ID', 'Kode', 'Nama Pohon', 'Komunitas', 'Deskripsi', 'Action'].map((head) => (
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
                <TableCell>{tree.code}</TableCell>
                <TableCell>
                  <div>
                    <strong>Latin:</strong> {tree.masterTree?.latinName}
                  </div>
                  <div>
                    <strong>Lokal:</strong> {tree.masterTree?.localName}
                  </div>
                </TableCell>
                <TableCell>{tree.kelompokKomunitas?.name}</TableCell>
                <TableCell>
                  {/* <div>
                    <strong>Kategori:</strong> {TreeCategoryLabel[tree.category]}
                  </div>
                  <div>
                    <strong>Diameter:</strong> {tree.diameter} cm
                  </div>
                  <div>
                    <strong>Serapan Karbon (CO2):</strong> {tree.serapanCo2} kg
                  </div> */}
                  <div>
                    <strong>Jenis Tanah:</strong> {LandTypeLabel[tree.landType]}
                  </div>
                </TableCell>
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
