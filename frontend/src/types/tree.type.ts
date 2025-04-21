import { Tree } from '@server/routes/tree';

import { AdoptHistoryType } from './adoptHistory.type';
import { KelompokKomunitasType } from './kelompokKomunitas.type';
import { MasterTreeType } from './masterTree.type';
import { SurveyHistoryType } from './surveyHistory.type';
import { UserType } from './user.type';

export type TreeType = Tree & {
  kelompokKomunitas: KelompokKomunitasType | null;
  surveyor: UserType | null;
  masterTree: MasterTreeType | null;
  surveyHistory: SurveyHistoryType[] | null;
  survey: SurveyHistoryType | null;
  adoptHistory: AdoptHistoryType[] | null;
  adopter: AdoptHistoryType | null;
};
