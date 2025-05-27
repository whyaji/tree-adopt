import { createFileRoute } from '@tanstack/react-router';

import { UserListScreen } from '@/features/admin-panel/screen/config/screen/user/screen/UserListScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/config/user/')({
  component: UserListScreen,
});
