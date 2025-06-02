import { createFileRoute } from '@tanstack/react-router';

import { GroupActivityListScreen } from '@/features/admin-panel/screen/tentang-kami/screen/group-activity/screen/GroupActivityListScreen';
import { getKelompokKomunitasById } from '@/lib/api/kelompokKomunitasApi';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/$kelompokKomunitasId/aktivitas/'
)({
  loader: async ({ params }) => {
    if (params.kelompokKomunitasId) {
      try {
        const res = await getKelompokKomunitasById(params.kelompokKomunitasId);
        return { kelompokKomunitas: res.data as KelompokKomunitasType };
      } catch {
        return { kelompokKomunitas: null };
      }
    } else {
      return { kelompokKomunitas: null };
    }
  },
  component: GroupActivityListScreen,
});
