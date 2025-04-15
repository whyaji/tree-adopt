import { createFileRoute } from '@tanstack/react-router';

import { DetailKelompokKomunitasScreen } from '@/features/tentang-kami/screen/kelompok-komunitas/screen/DetailKelompokKomunitasScreen';
import { getKelompokKomunitasByName } from '@/lib/api/kelompokKomunitasApi';

export const Route = createFileRoute(
  '/_authenticated/tentang-kami/kelompok-komunitas/$kelompokKomunitasName'
)({
  loader: async ({ params }) => {
    try {
      const res = await getKelompokKomunitasByName(params.kelompokKomunitasName);
      return { kelompokKomunitas: res.data[0] };
    } catch {
      return { kelompokKomunitas: null };
    }
  },
  component: DetailKelompokKomunitasScreen,
});
