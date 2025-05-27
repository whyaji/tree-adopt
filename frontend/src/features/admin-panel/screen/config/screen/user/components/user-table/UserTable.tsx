import { useNavigate } from '@tanstack/react-router';
import { Pen, Trash } from 'lucide-react';
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
import { deleteUser } from '@/lib/api/userApi';
import { UserType } from '@/types/user.type';

export function UserTable({ data, isPending }: { data?: UserType[]; isPending: boolean }) {
  const navigate = useNavigate();

  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'Nama', 'Email', 'Tipe User', 'Action'].map((head) => (
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
          : data?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 0 ? 'Admin' : user.role === 1 ? 'User' : 'Unknown'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate({
                          to: `/admin/config/user/${user.id}/update`,
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
                          await deleteUser(String(user.id));
                          window.location.reload();
                        } catch (error) {
                          console.error(error);
                          toast.error('Failed to delete komunitas');
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
