import { SurveyHistory } from '@server/routes/surveyHistory';

import { TreeType } from './tree.type';
import { UserType } from './user.type';

export type SurveyHistoryType = SurveyHistory & {
  user: UserType | null;
  tree: TreeType | null;
};
