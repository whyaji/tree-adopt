import { createFileRoute } from '@tanstack/react-router';

import { SurveyHistoryTreeScreen } from '@/features/admin-panel/screen/data/screen/survey-history/screen/SurveyHistoryTreeScreen';
import { getTree } from '@/lib/api/treeApi';

export const Route = createFileRoute(
  '/_authenticated_admin/admin/data/pohon/survey-history/$treeId'
)({
  loader: async ({ params }) => {
    try {
      const res = await getTree(params.treeId, 'surveyorId,kelompokKomunitasId,masterTreeId');
      return { tree: res.data };
    } catch {
      return { tree: null };
    }
  },
  component: SurveyHistoryTreeScreen,
});
