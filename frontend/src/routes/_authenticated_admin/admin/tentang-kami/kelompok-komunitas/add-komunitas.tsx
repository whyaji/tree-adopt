import { createFileRoute } from '@tanstack/react-router';

import { PERMISSION } from '@/enum/permission.enum';
import { TambahKelompokKomunitasScreen } from '@/features/admin-panel/screen/tentang-kami/screen/kelompok-komunitas/screen/TambahKelompokKomunitasScreen';
import { useProtectRoute } from '@/hooks/use-protect-route';

const Component = () => {
  useProtectRoute([PERMISSION.COMUNITY_GROUP_CREATE]);
  return <TambahKelompokKomunitasScreen />;
};

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/add-komunitas'
)({
  component: Component,
});
