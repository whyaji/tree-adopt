import { createFileRoute } from '@tanstack/react-router';

import { UpdateGroupActivityScreen } from '@/features/admin-panel/screen/tentang-kami/screen/group-activity/screen/UpdateGroupActivityScreen';
import { getGroupActivity } from '@/lib/api/groupActivityApi';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/tentang-kami/kelompok-komunitas/$kelompokKomunitasId/aktivitas/$groupActivityId/update/'
)({
  loader: async ({ params }) => {
    if (params.kelompokKomunitasId && params.groupActivityId) {
      try {
        const groupActivity = await getGroupActivity(params.kelompokKomunitasId);

        if (groupActivity.data) {
          return {
            kelompokKomunitasId: params.kelompokKomunitasId,
            groupActivity: groupActivity.data,
          };
        } else {
          throw new Error('Group activity not found');
        }
      } catch (error) {
        console.error('Error fetching group activity:', error);
        return {
          kelompokKomunitasId: params.kelompokKomunitasId,
          groupActivity: null,
        };
      }
    } else {
      return {
        kelompokKomunitasId: null,
        groupActivity: null,
      };
    }
  },
  component: UpdateGroupActivityScreen,
});
