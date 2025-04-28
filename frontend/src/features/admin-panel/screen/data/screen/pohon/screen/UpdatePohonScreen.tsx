import { Route } from '@/routes/_authenticated_admin/admin/data/pohon/$treeId/update';

import { FormPohon } from '../components/form-pohon/FormPohon';

export function UpdatePohonScreen() {
  const { tree } = Route.useLoaderData();
  return <FormPohon tree={tree} />;
}
