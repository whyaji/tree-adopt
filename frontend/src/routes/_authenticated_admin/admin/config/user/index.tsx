import { createFileRoute } from '@tanstack/react-router';

import { UserListScreen } from '@/features/admin-panel/screen/config/screen/user/screen/UserListScreen';
import { useProtectRoute } from '@/hooks/use-protect-route';

const Component = () => {
  useProtectRoute(['user-management.view']);
  return <UserListScreen />;
};

export const Route = createFileRoute('/_authenticated_admin/admin/config/user/')({
  component: Component,
});
