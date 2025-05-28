import { FC } from 'react';

import { GroupedPermissionType } from '@/types/permission.type';
import { RoleType } from '@/types/role.type';

const FormRolesPermission: FC<{
  role: RoleType;
  groupPermissions: GroupedPermissionType[];
}> = ({ groupPermissions, role }) => {
  return (
    <div className="flex flex-col gap-4">
      {groupPermissions.map((group) => (
        <div key={group.groupCode} className="space-y-2">
          <h3 className="text-lg font-semibold">{group.groupName}</h3>
          <ul className="list-disc pl-5">
            {group.permissions.map((permission) => (
              <li key={permission.id} className="text-sm">
                {permission.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default FormRolesPermission;
