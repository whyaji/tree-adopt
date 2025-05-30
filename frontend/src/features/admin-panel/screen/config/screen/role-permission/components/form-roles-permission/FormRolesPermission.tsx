import { FC, useEffect, useState } from 'react';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GroupedPermissionType } from '@/types/permission.type';
import { RoleType } from '@/types/role.type';

import { saveRolePermissions } from '../../api/rolePermissionApi';

const FormRolesPermission: FC<{
  role?: RoleType;
  groupPermissions: GroupedPermissionType[];
  onSaved?: () => void;
}> = ({ groupPermissions, role, onSaved }) => {
  const [permissionsIds, setPermissionsIds] = useState<number[]>([]);

  const defaultPermissionsIds = useMemo(() => role?.permissions?.map((p) => p.id) ?? [], [role]);

  useEffect(() => {
    if (role) {
      setPermissionsIds(defaultPermissionsIds);
    } else {
      setPermissionsIds([]);
    }
  }, [defaultPermissionsIds, role]);

  const handleSavePermissions = async () => {
    if (!role) {
      console.error('No role provided to save permissions');
      toast.error('No role provided to save permissions');
      return;
    }

    try {
      await saveRolePermissions(role.id, permissionsIds);
      onSaved?.();
      toast.success('Permissions saved successfully');
    } catch (error) {
      console.error('Failed to save permissions:', error);
      toast.error('Failed to save permissions');
    }
  };

  // variable permissionsIds is same as defaultPermissionsIds
  const isPermissionsChanged = useMemo(() => {
    return (
      permissionsIds.length !== defaultPermissionsIds.length ||
      permissionsIds.some((id) => !defaultPermissionsIds.includes(id)) ||
      defaultPermissionsIds.some((id) => !permissionsIds.includes(id))
    );
  }, [permissionsIds, defaultPermissionsIds]);

  return (
    <div className="flex flex-col gap-4">
      {groupPermissions.map((group) => (
        <div key={group.groupCode} className="space-y-2">
          <h3 className="text-lg font-semibold">{group.groupName}</h3>
          {role ? (
            <ul className="list-disc pl-5">
              {group.permissions.map((permission) => (
                <li key={permission.id} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={permissionsIds.includes(permission.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPermissionsIds((prev) => [...prev, permission.id]);
                      } else {
                        setPermissionsIds((prev) => prev.filter((id) => id !== permission.id));
                      }
                    }}
                  />
                  {permission.name}
                </li>
              ))}
            </ul>
          ) : (
            <ul className="list-disc pl-5">
              {group.permissions.map((permission) => (
                <li key={permission.id} className="text-sm">
                  {permission.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {role && isPermissionsChanged && (
        // Button cancel and save permissions
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="px-4 py-2"
            onClick={() => setPermissionsIds(defaultPermissionsIds)}>
            Cancel
          </Button>
          <Button
            className="px-4 py-2"
            onClick={(e) => {
              e.preventDefault();
              // Handle save permissions logic here
              handleSavePermissions();
            }}>
            Save Permissions
          </Button>
        </div>
      )}
    </div>
  );
};

export default FormRolesPermission;
