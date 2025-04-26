import { createFileRoute } from '@tanstack/react-router';

import { AddSurveyHistoryTreeScreen } from '@/features/admin-panel/screen/data/screen/survey-history/screen/AddSurveyHistoryTreeScreen';
import { getTree } from '@/lib/api/treeApi';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/data/pohon/$treeId/survey-history/add/'
)({
  loader: async ({ params }) => {
    try {
      const res = await getTree(params.treeId);
      return { tree: res.data };
    } catch {
      return { tree: null };
    }
  },
  component: AddSurveyHistoryTreeScreen,
});
