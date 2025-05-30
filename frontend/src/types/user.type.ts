import { User } from '@server/routes/auth';

import { RoleType } from './role.type';

export type UserType = User & {
  roles?: RoleType[];
  permissions?: string[]; // List of permission codes
};
