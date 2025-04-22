import { createFileRoute } from '@tanstack/react-router';

import { AddPohonScreen } from '@/features/admin-panel/screen/data/screen/pohon/screen/AddPohonScreen';

export const Route = createFileRoute('/_authenticated_admin/admin/data/pohon/add/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AddPohonScreen />;
}
