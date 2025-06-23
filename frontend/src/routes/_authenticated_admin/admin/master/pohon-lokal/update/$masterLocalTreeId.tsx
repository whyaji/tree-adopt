import { createFileRoute } from '@tanstack/react-router';

import { UpdateMasterLocalTreeScreen } from '@/features/admin-panel/screen/master/screen/local-tree/screen/UpdateMasterLocalTreeScreen';
import { getMasterTreeLocal } from '@/lib/api/masterTreeApi';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/master/pohon-lokal/update/$masterLocalTreeId'
)({
  loader: async ({ params }) => {
    try {
      const res = await getMasterTreeLocal(params.masterLocalTreeId, 'masterTreeId');
      return { masterLocalTree: res.data };
    } catch {
      return { masterLocalTree: null };
    }
  },
  component: UpdateMasterLocalTreeScreen,
});
