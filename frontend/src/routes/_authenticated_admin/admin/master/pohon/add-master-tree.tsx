import { createFileRoute } from '@tanstack/react-router';

import { TambahMasterPohonScreen } from '@/features/admin-panel/screen/master/screen/pohon/screen/TambahMasterPohonScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/master/pohon/add-master-tree')({
  component: TambahMasterPohonScreen,
});
