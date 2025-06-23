import { createFileRoute } from '@tanstack/react-router';

import { AddBoundaryMarkerScreen } from '@/features/admin-panel/screen/data/screen/boundary-marker/screen/AddBoundaryMarkerScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/data/patok-batas/add/')({
  component: AddBoundaryMarkerScreen,
});
