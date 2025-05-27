import { createFileRoute } from '@tanstack/react-router';

import { AddUserScreen } from '@/features/admin-panel/screen/config/screen/user/screen/AddUserScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/config/user/add/')({
  component: AddUserScreen,
});
