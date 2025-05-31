import { createFileRoute } from '@tanstack/react-router';

import { PERMISSION } from '@/enum/permission.enum';
import { AddUserScreen } from '@/features/admin-panel/screen/config/screen/user/screen/AddUserScreen';
import { useProtectRoute } from '@/hooks/use-protect-route';

const Component = () => {
  useProtectRoute([
    PERMISSION.USER_MANAGEMENT_CREATE_LEVEL_GLOBAL,
    PERMISSION.USER_MANAGEMENT_CREATE_LEVEL_GROUP,
  ]);
  return <AddUserScreen />;
};

export const Route = createFileRoute('/_authenticated_admin/admin/config/user/add/')({
  component: Component,
});
