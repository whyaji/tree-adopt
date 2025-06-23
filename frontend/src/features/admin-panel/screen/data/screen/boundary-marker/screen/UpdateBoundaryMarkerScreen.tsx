import { Route } from '@/routes/_authenticated_admin/admin/data/patok-batas/$boundaryMarkerId/update';

import { FormBoundaryMarker } from '../components/form-boundary-marker/FormBoundaryMarker';

export function UpdateBoundaryMarkerScreen() {
  const { boundaryMarker } = Route.useLoaderData();
  return <FormBoundaryMarker boundaryMarker={boundaryMarker} />;
}
