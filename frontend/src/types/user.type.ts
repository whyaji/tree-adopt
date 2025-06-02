import { User } from '@server/routes/auth';

import { KelompokKomunitasType } from './kelompokKomunitas.type';
import { RoleType } from './role.type';

export type UserType = User & {
  kelompokKomunitas?: KelompokKomunitasType | null;
  roles?: RoleType[];
  permissions?: string[]; // List of permission codes
};
