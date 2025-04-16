import { createFileRoute } from '@tanstack/react-router';

import { MasterPohonListScreen } from '@/features/admin-panel/screen/master/screen/pohon/screen/MasterPohonListScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/master/pohon/')({
  component: MasterPohonListScreen,
});
