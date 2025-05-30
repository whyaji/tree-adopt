import { Role } from '@server/routes/roles';

import { PermissionType } from './permission.type';

export type RoleType = Role & {
  permissions?: PermissionType[];
};
