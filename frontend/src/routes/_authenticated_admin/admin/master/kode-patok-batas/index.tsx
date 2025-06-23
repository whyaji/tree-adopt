import { createFileRoute } from '@tanstack/react-router';

import { BoundaryMarkerCodeListScreen } from '@/features/admin-panel/screen/master/screen/boundary-marker-code/screen/BoundaryMarkerCodeListScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/master/kode-patok-batas/')({
  component: BoundaryMarkerCodeListScreen,
});
