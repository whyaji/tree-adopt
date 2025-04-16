import { createFileRoute } from '@tanstack/react-router';

import { UpdateKelompokKomunitasScreen } from '@/features/admin-panel/screen/tentang-kami/screen/kelompok-komunitas/screen/UpdateKelompokKomunitasScreen';
import { getKelompokKomunitasById } from '@/lib/api/kelompokKomunitasApi';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/update-komunitas/$kelompokKomunitasId'
)({
  loader: async ({ params }) => {
    try {
      const res = await getKelompokKomunitasById(params.kelompokKomunitasId);
      return { komunitas: res.data };
    } catch {
      return { komunitas: null };
    }
  },
  component: UpdateKelompokKomunitasScreen,
});
