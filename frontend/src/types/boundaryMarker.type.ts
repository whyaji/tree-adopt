import { BoundaryMarker } from '@server/routes/boundary-marker/boundaryMarker';
import { CheckBoundaryMarkerHistory } from '@server/routes/boundary-marker/boundaryMarkerCheckHistory';
import { BoundaryMarkerCode } from '@server/routes/boundary-marker/boundaryMarkerCode';

import { KelompokKomunitasType } from './kelompokKomunitas.type';
import { UserType } from './user.type';

export type BoundaryMarkerType = BoundaryMarker & {
  checker?: UserType | null;
  kelompokKomunitas?: KelompokKomunitasType | null;
  checkBoundaryMarkerHistory?: CheckBoundaryMarkerHistory[] | null;
};

export type BoundarymarkerCodeType = BoundaryMarkerCode & {
  marker?: UserType | null;
  kelompokKomunitas?: KelompokKomunitasType | null;
};

export type CheckBmHistoryType = CheckBoundaryMarkerHistory & {
  boundaryMarker?: BoundaryMarkerType | null;
  checker?: UserType | null;
  kelompokKomunitas?: KelompokKomunitasType | null;
};
