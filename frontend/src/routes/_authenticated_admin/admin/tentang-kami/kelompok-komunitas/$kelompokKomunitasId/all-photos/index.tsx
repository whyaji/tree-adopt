import { createFileRoute } from '@tanstack/react-router';

import { AllPhotosKelompokKomunitas } from '@/features/admin-panel/screen/tentang-kami/screen/kelompok-komunitas/screen/all-photos/screen/AllPhotosKelompokKomunitas';

const Component = () => {
  const { kelompokKomunitasId } = Route.useLoaderData();
  return <AllPhotosKelompokKomunitas kelompokKomunitasId={kelompokKomunitasId} />;
};

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/$kelompokKomunitasId/all-photos/'
)({
  loader: async ({ params }) => {
    return {
      kelompokKomunitasId: params.kelompokKomunitasId,
    };
  },
  component: Component,
});
