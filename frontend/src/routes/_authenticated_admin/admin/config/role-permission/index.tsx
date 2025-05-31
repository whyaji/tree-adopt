import { createFileRoute } from '@tanstack/react-router';

import { PERMISSION } from '@/enum/permission.enum';
import { RolePermissionScreen } from '@/features/admin-panel/screen/config/screen/role-permission/screen/RolePermissionScreen';
import { useProtectRoute } from '@/hooks/use-protect-route';

const Component = () => {
  useProtectRoute([PERMISSION.ROLE_PERMISSION_MANAGEMENT_VIEW]);
  return <RolePermissionScreen />;
};

export const Route = createFileRoute('/_authenticated_admin/admin/config/role-permission/')({
  component: Component,
});
