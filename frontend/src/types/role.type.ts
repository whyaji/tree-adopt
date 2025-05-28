import { Role } from '@server/routes/roles';

export type RoleType = Role & {
  permissions?: string[];
};
