import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { TableData } from '@/components/table-data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { usePaginationFilter } from '@/hooks/use-pagination-filter';
import { GroupedPermissionType, PermissionType } from '@/types/permission.type';
import { RoleType } from '@/types/role.type';

import { getPermissions, getRoles } from '../api/rolePermissionApi';
import { DialogFormPermissionContent } from '../components/dialog-form-permission/DialogFormPermission';
import { DialogFormRoleContent } from '../components/dialog-form-role/DialogFormRole';
import FormRolesPermission from '../components/form-roles-permission/FormRolesPermission';
import RoleTable from '../components/role-table/RoleTable';

export function RolePermissionScreen() {
  const { page, setPage, limit, setLimit, search, tempSearch, setTempSearch } =
    usePaginationFilter();

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ['get-roles', search, page, limit],
    queryFn: () => getRoles({ search, page, limit }),
  });

  const totalPage = data?.totalPage ?? 0;

  const {
    isPending: isPendingPermission,
    error: errorPermission,
    data: dataPermission,
  } = useQuery({
    queryKey: ['get-permissions'],
    queryFn: () => getPermissions({ page: 1, limit: 9999 }),
  });

  const [selectedRole, setSelectedRole] = useState<RoleType | undefined>(undefined);

  if (error || errorPermission) {
    return <div>Error: {error?.message ?? errorPermission?.message}</div>;
  }

  // const permissionSchemaZod = z.object({
  //   id: z.number().int().positive(),
  //   name: z.string().min(1),
  //   code: z.string().min(1),
  //   groupCode: z.string().min(1),
  //   groupName: z.string().min(1),

  const permissions: PermissionType[] = dataPermission?.data ?? [];

  const groupedPermissions: GroupedPermissionType[] = permissions.reduce(
    (acc: GroupedPermissionType[], permission: PermissionType) => {
      const groupIndex = acc.findIndex((group) => group.groupCode === permission.groupCode);

      if (groupIndex === -1) {
        acc.push({
          id: permission.id,
          groupName: permission.groupName,
          groupCode: permission.groupCode,
          permissions: [permission],
        });
      } else {
        acc[groupIndex].permissions.push(permission);
      }

      return acc;
    },
    []
  );

  const groupNames = groupedPermissions.map((group) => group.groupName);

  return (
    <div className="m-auto mt-6 max-w-7xl px-4">
      <h1 className="text-2xl font-bold mb-4">Role Permission</h1>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <TableData
            title="Role"
            tempSearch={tempSearch}
            setTempSearch={setTempSearch}
            page={page}
            setPage={setPage}
            totalPage={totalPage}
            limit={limit}
            setLimit={setLimit}
            elementsHeader={[
              <Dialog key="add-role-dialog">
                <DialogTrigger asChild>
                  <Button variant="default">+</Button>
                </DialogTrigger>
                <DialogFormRoleContent type="create" onSave={refetch} />
              </Dialog>,
            ]}
            table={
              <RoleTable
                data={data?.data}
                isPending={isPending}
                onRefresh={refetch}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
              />
            }
          />
        </div>
        <div className="flex-1">
          <div>
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-semibold mb-4">Permissions</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">+</Button>
                </DialogTrigger>
                <DialogFormPermissionContent
                  type="create"
                  onSave={refetch}
                  groupSuggestions={groupNames}
                />
              </Dialog>
            </div>
            {selectedRole && (
              <>
                <h2 className="text-xl font-semibold mb-4">
                  Edit Permissions Role: {selectedRole.name}
                </h2>
                {isPendingPermission ? (
                  <p>Loading permissions...</p>
                ) : (
                  <FormRolesPermission role={selectedRole} groupPermissions={groupedPermissions} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
