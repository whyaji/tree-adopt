import { createFileRoute } from '@tanstack/react-router';

import { AddMasterLocalTreeScreen } from '@/features/admin-panel/screen/master/screen/local-tree/screen/AddMasterLocalTreeScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/master/pohon-lokal/add/')({
  component: AddMasterLocalTreeScreen,
});
