import { Route } from '@/routes/_authenticated_admin/admin/master/pohon/update/$masterTreeId';

import { FormMasterPohon } from '../components/form-master-pohon/FormMasterPohon';

export function UpdateMasterPohonScreen() {
  const { masterTree } = Route.useLoaderData();
  return <FormMasterPohon masterTree={masterTree} />;
}
