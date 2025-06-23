import { Route } from '@/routes/_authenticated_admin/admin/master/kode-patok-batas/$boundaryMarkerCodeId/update';

import { FormBoundaryMarkerCode } from '../components/form-boundary-marker-code/FormBoundaryMarkerCode';

export function UpdateBoundaryMarkerCodeScreen() {
  const { boundaryMarkerCode } = Route.useLoaderData();
  return <FormBoundaryMarkerCode boundaryMarkerCode={boundaryMarkerCode} />;
}
