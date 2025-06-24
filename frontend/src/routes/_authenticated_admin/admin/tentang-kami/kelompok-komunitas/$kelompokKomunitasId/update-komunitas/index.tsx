import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import { PERMISSION } from '@/enum/permission.enum';
import { UpdateKelompokKomunitasScreen } from '@/features/admin-panel/screen/tentang-kami/screen/kelompok-komunitas/screen/UpdateKelompokKomunitasScreen';
import { getKelompokKomunitasById } from '@/lib/api/kelompokKomunitasApi';
import { useUserStore } from '@/lib/stores/userStore';
import { checkPermissionWithLevelAndGoToNotAuthorized } from '@/lib/utils/permissions';
import { KelompokKomunitasType } from '@/types/kelompokKomunitas.type';

const Component = () => {
  const { kelompokKomunitasId } = Route.useLoaderData();
  const [kelompokKomunitas, setKelompokKomunitas] = useState<KelompokKomunitasType | undefined>(
    undefined
  );

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKelompokKomunitas = async () => {
      if (kelompokKomunitasId) {
        try {
          const res = await getKelompokKomunitasById(kelompokKomunitasId, 'groupCoordinateArea');
          if (res.data) {
            setKelompokKomunitas(res.data);
          } else {
            console.error('Kelompok komunitas not found');
            setKelompokKomunitas(undefined);
          }
        } catch (error) {
          console.error('Error fetching kelompok komunitas:', error);
          setKelompokKomunitas(undefined);
        }
      }
    };

    const isEditor = checkPermissionWithLevelAndGoToNotAuthorized(
      navigate,
      user?.permissions ?? [],
      [PERMISSION.COMUNITY_GROUP_UPDATE_LEVEL_GLOBAL],
      [PERMISSION.COMUNITY_GROUP_UPDATE_LEVEL_GROUP],
      kelompokKomunitasId,
      [String(user?.groupId ?? '')]
    );

    if (isEditor) {
      fetchKelompokKomunitas();
    }
  }, [kelompokKomunitasId, navigate, user?.groupId, user?.permissions]);

  return (
    kelompokKomunitas && <UpdateKelompokKomunitasScreen kelompokKomunitas={kelompokKomunitas} />
  );
};

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/$kelompokKomunitasId/update-komunitas/'
)({
  loader: async ({ params }) => {
    return {
      kelompokKomunitasId: params.kelompokKomunitasId,
    };
  },
  component: Component,
});
