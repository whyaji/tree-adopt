import { createFileRoute } from '@tanstack/react-router';

import { PERMISSION } from '@/enum/permission.enum';
import { KelompokKomunitasListScreen } from '@/features/admin-panel/screen/tentang-kami/screen/kelompok-komunitas/screen/KelompokKomunitasListScreen';
import { useProtectRoute } from '@/hooks/use-protect-route';

const Component = () => {
  useProtectRoute([
    PERMISSION.COMUNITY_GROUP_VIEW_LEVEL_GLOBAL,
    PERMISSION.COMUNITY_GROUP_VIEW_LEVEL_GROUP,
  ]);
  return <KelompokKomunitasListScreen />;
};

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/'
)({
  component: Component,
});
