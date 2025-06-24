import { createFileRoute } from '@tanstack/react-router';

import { DetailKelompokKomunitasScreen } from '@/features/tentang-kami/screen/kelompok-komunitas/screen/DetailKelompokKomunitasScreen';
import { getGroupActivities } from '@/lib/api/groupActivityApi';
import { getKelompokKomunitasByName } from '@/lib/api/kelompokKomunitasApi';
import { getTrees } from '@/lib/api/treeApi';

export const Route = createFileRoute(
  '/_authenticated/tentang-kami/kelompok-komunitas/$kelompokKomunitasName'
)({
  loader: async ({ params }) => {
    if (params.kelompokKomunitasName) {
      try {
        const res = await getKelompokKomunitasByName(
          params.kelompokKomunitasName,
          'groupCoordinateArea'
        );
        const resTrees = await getTrees({
          limit: 9999,
          page: 1,
          filter: `kelompokKomunitasId:${res.data.id}:eq`,
          select: 'id,code,localTreeName,latitude,longitude',
        });
        const resActitvities = await getGroupActivities({
          limit: 5,
          page: 1,
          filter: `kelompokKomunitasId:${res.data.id}:eq`,
          select: 'id,title,image,latitude,longitude',
        });
        return {
          kelompokKomunitas: {
            ...res.data,
            trees: resTrees?.data ?? [],
            groupActivities: resActitvities?.data ?? [],
          },
        };
      } catch {
        return { kelompokKomunitas: null };
      }
    }
  },
  component: DetailKelompokKomunitasScreen,
});
