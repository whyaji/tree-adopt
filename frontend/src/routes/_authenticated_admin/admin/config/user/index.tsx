import { createFileRoute } from '@tanstack/react-router';

import { PERMISSION } from '@/enum/permission.enum';
import { UserListScreen } from '@/features/admin-panel/screen/config/screen/user/screen/UserListScreen';
import { useProtectRoute } from '@/hooks/use-protect-route';

const Component = () => {
  useProtectRoute([PERMISSION.USER_MANAGEMENT_VIEW]);
  return <UserListScreen />;
};

export const Route = createFileRoute('/_authenticated_admin/admin/config/user/')({
  component: Component,
});
