import { createFileRoute } from '@tanstack/react-router';

import { PohonListScreen } from '@/features/admin-panel/screen/data/screen/pohon/screen/PohonListScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/data/pohon/')({
  component: PohonListScreen,
});
