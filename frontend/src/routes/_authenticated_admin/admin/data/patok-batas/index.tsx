import { createFileRoute } from '@tanstack/react-router';

import { BoundaryMarkerListScreen } from '@/features/admin-panel/screen/data/screen/boundary-marker/screen/BoundaryMarkerListScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/data/patok-batas/')({
  component: BoundaryMarkerListScreen,
});
