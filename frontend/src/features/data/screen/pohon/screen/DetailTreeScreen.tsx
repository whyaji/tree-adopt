import { DetailTreeScreenComponent } from '@/components/screen/detail-tree-screen-component';
import { Route } from '@/routes/_authenticated/data/pohon/$treeId';

export function DetailTreeScreen() {
  const { tree } = Route.useLoaderData();
  return <DetailTreeScreenComponent tree={tree} />;
}
