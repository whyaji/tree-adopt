import { createFileRoute } from '@tanstack/react-router';

import { AddGroupActivityScreen } from '@/features/admin-panel/screen/tentang-kami/screen/group-activity/screen/AddGroupActivityScreen';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/$kelompokKomunitasId/aktivitas/add/'
)({
  loader: async ({ params }) => {
    return {
      kelompokKomunitasId: params.kelompokKomunitasId,
    };
  },
  component: AddGroupActivityScreen,
});
