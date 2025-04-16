import { createFileRoute } from '@tanstack/react-router';

import { KelompokKomunitasListScreen } from '@/features/admin-panel/screen/tentang-kami/screen/kelompok-komunitas/screen/KelompokKomunitasListScreen';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/'
)({
  component: KelompokKomunitasListScreen,
});
