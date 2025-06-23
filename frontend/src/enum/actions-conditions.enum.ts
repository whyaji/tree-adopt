export enum CONDITIONS_BOUNDARY_MARKER {
  GOOD = 'good',
  COLOR_TEXT_UNCLEAR = 'color_text_unclear',
  WRONG_PLACEMENT = 'wrong_placement',
  DAMAGED = 'damaged',
  LOST = 'lost',
}

export enum ACTIONS_BOUNDARY_MARKER {
  CLEANED = 'cleaned',
  FIXED_REPAINTED = 'fixed_repainted',
  MOVED = 'moved',
  REPLACED = 'replaced',
  REPORTED = 'reported',
}

export const CONDITIONS_BOUNDARY_MARKER_LIST = Object.values(CONDITIONS_BOUNDARY_MARKER);
export const ACTIONS_BOUNDARY_MARKER_LIST = Object.values(ACTIONS_BOUNDARY_MARKER);

export const CONDITIONS_BOUNDARY_MARKER_LABELS: Record<CONDITIONS_BOUNDARY_MARKER, string> = {
  [CONDITIONS_BOUNDARY_MARKER.GOOD]: 'Baik',
  [CONDITIONS_BOUNDARY_MARKER.COLOR_TEXT_UNCLEAR]: 'Warna / Tulisan Kode Patok Tidak Jelas',
  [CONDITIONS_BOUNDARY_MARKER.WRONG_PLACEMENT]: 'Salah Posisi Pemasangan Patok',
  [CONDITIONS_BOUNDARY_MARKER.DAMAGED]: 'Rusak',
  [CONDITIONS_BOUNDARY_MARKER.LOST]: 'Hilang',
};

export const ACTIONS_BOUNDARY_MARKER_LABELS: Record<ACTIONS_BOUNDARY_MARKER, string> = {
  [ACTIONS_BOUNDARY_MARKER.CLEANED]: 'Dibersihkan',
  [ACTIONS_BOUNDARY_MARKER.FIXED_REPAINTED]: 'Diperbaiki / Dicat Ulang',
  [ACTIONS_BOUNDARY_MARKER.MOVED]: 'Dipindahkan Posisi Patok Batas',
  [ACTIONS_BOUNDARY_MARKER.REPLACED]: 'Diganti Patok Batas Baru',
  [ACTIONS_BOUNDARY_MARKER.REPORTED]: 'Dilaporkan',
};

export const ACTIONS_CONDTIONS_BOUNDARY_MARKER_LABELS: Record<string, string> = {
  ...CONDITIONS_BOUNDARY_MARKER_LABELS,
  ...ACTIONS_BOUNDARY_MARKER_LABELS,
};

export const getConditionsLabelIsTrue = (conditions: Record<string, boolean>): string[] => {
  return CONDITIONS_BOUNDARY_MARKER_LIST.filter((condition) => conditions[condition] === true).map(
    (condition) => CONDITIONS_BOUNDARY_MARKER_LABELS[condition]
  );
};

export const getActionsLabelIsTrue = (actions: Record<string, boolean>): string[] => {
  return ACTIONS_BOUNDARY_MARKER_LIST.filter((action) => actions[action] === true).map(
    (action) => ACTIONS_BOUNDARY_MARKER_LABELS[action]
  );
};
