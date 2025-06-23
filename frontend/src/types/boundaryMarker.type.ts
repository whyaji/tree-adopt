import { BoundaryMarkerCode } from '@server/routes/boundary-marker/boundaryMarkerCode';

import { KelompokKomunitasType } from './kelompokKomunitas.type';
import { UserType } from './user.type';

export type BoundarymarkerCodeType = BoundaryMarkerCode & {
  marker?: UserType | null;
  kelompokKomunitas?: KelompokKomunitasType | null;
};
