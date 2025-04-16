import { createFileRoute } from '@tanstack/react-router';

import { FormKelompokKomunitas } from '@/features/admin-panel/screen/tentang-kami/screen/kelompok-komunitas/components/form-kelompok-komunitas/FormKelompokKomunitas';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/add-komunitas'
)({
  component: FormKelompokKomunitas,
});
