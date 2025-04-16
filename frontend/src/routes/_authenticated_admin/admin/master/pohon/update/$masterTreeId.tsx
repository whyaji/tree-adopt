import { createFileRoute } from '@tanstack/react-router';

import { UpdateMasterPohonScreen } from '@/features/admin-panel/screen/master/screen/pohon/screen/UpdateMasterPohonScreen';
import { getMasterTree } from '@/lib/api/masterTreeApi';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/master/pohon/update/$masterTreeId'
)({
  loader: async ({ params }) => {
    try {
      const res = await getMasterTree(params.masterTreeId);
      return { masterTree: res.data };
    } catch {
      return { masterTree: null };
    }
  },
  component: UpdateMasterPohonScreen,
});
