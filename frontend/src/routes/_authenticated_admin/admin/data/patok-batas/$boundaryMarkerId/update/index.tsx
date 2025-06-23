import { createFileRoute } from '@tanstack/react-router';

import { UpdateBoundaryMarkerScreen } from '@/features/admin-panel/screen/data/screen/boundary-marker/screen/UpdateBoundaryMarkerScreen';
import { getBoundaryMarker } from '@/lib/api/boundaryMarkerApi';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/data/patok-batas/$boundaryMarkerId/update/'
)({
  loader: async ({ params }) => {
    try {
      const res = await getBoundaryMarker(params.boundaryMarkerId);
      return { boundaryMarker: res.data };
    } catch {
      return { boundaryMarker: null };
    }
  },
  component: UpdateBoundaryMarkerScreen,
});
