import { DialogTrigger } from '@radix-ui/react-dialog';
import { Pen, Trash } from 'lucide-react';
import { FC } from 'react';
import { toast } from 'sonner';

import { ConfirmationDialog } from '@/components/confimation-dialog';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RoleType } from '@/types/role.type';

import { deleteRole } from '../../api/rolePermissionApi';
import { DialogFormRoleContent } from '../dialog-form-role/DialogFormRole';

const RoleTable: FC<{
  data?: RoleType[];
  isPending: boolean;
  onRefresh?: () => void;
  selectedRole?: RoleType;
  setSelectedRole?: (item: RoleType) => void;
}> = ({ data, isPending, onRefresh, setSelectedRole, selectedRole }) => {
  if (!data && !isPending) {
    return <div className="text-center">No data available</div>;
  }

  return (
    <Table>
      <TableHeader className="sticky top-0 z-10 bg-background">
        <TableRow>
          {['ID', 'Nama', 'Kode', 'Action'].map((head) => (
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
          : data?.map((role) => (
              <Tooltip key={role.id}>
                <TooltipTrigger asChild>
                  <TableRow
                    onClick={() => setSelectedRole?.(role)}
                    className={`${selectedRole?.id === role.id ? 'bg-muted' : ''}`}>
                    <TableCell>{role.id}</TableCell>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.code}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog key="add-role-dialog">
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Pen className="h-4 w-4" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogFormRoleContent type="create" onSave={onRefresh} role={role} />
                        </Dialog>
                        <ConfirmationDialog
                          title="Apakah anda yakin untuk menghapus?"
                          message="Data yang dihapus tidak dapat dikembalikan."
                          confirmText="Delete"
                          onConfirm={async () => {
                            try {
                              await deleteRole(String(role.id));
                              window.location.reload();
                            } catch (error) {
                              console.error(error);
                              toast.error('Failed to delete role');
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>{role.description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
      </TableBody>
    </Table>
  );
};

export default RoleTable;
