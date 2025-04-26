import { Route } from '@/routes/_authenticated_admin/admin/data/pohon/$treeId/survey-history/add';

import { FormSurveyHistory } from '../components/form-survey-history/FormSurveyHistory';

export function AddSurveyHistoryTreeScreen() {
  const { tree } = Route.useLoaderData();
  return <FormSurveyHistory title="Add Survey Tree" tree={tree} />;
}
