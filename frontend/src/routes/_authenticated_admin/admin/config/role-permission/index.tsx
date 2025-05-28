import { createFileRoute } from '@tanstack/react-router';

import { RolePermissionScreen } from '@/features/admin-panel/screen/config/screen/role-permission/screen/RolePermissionScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/config/role-permission/')({
  component: RolePermissionScreen,
});
