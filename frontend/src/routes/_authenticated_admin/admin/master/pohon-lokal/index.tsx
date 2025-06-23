import { createFileRoute } from '@tanstack/react-router';

import { MasterLocalTreeListScreen } from '@/features/admin-panel/screen/master/screen/local-tree/screen/MasterLocalTreeListScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/master/pohon-lokal/')({
  component: MasterLocalTreeListScreen,
});
