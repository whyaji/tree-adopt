import { createFileRoute } from '@tanstack/react-router';

import { UpdateBoundaryMarkerCodeScreen } from '@/features/admin-panel/screen/master/screen/boundary-marker-code/screen/UpdateBoundaryMarkerCodeScreen';
import { getBoundaryMarkerCode } from '@/lib/api/boundaryMarkerApi';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/master/kode-patok-batas/$boundaryMarkerCodeId/update/'
)({
  loader: async ({ params }) => {
    try {
      const res = await getBoundaryMarkerCode(params.boundaryMarkerCodeId);
      return { boundaryMarkerCode: res.data };
    } catch {
      return { boundaryMarkerCode: null };
    }
  },
  component: UpdateBoundaryMarkerCodeScreen,
});
