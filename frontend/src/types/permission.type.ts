import { Permission } from '@server/routes/permissions';

export type PermissionType = Permission;

export type GroupedPermissionType = {
  id: number;
  groupName: string;
  groupCode: string;
  permissions: PermissionType[];
};
