import { createFileRoute } from '@tanstack/react-router';

import { AddBoundaryMarkerCodeScreen } from '@/features/admin-panel/screen/master/screen/boundary-marker-code/screen/AddBoundaryMarkerCodeScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/master/kode-patok-batas/add/')({
  component: AddBoundaryMarkerCodeScreen,
});
