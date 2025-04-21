export enum LAND_TYPE {
  MINERAL = 1,
  ORGANIK = 2,
  LAHAN_BASAH = 3,
}

export const LandTypeLabel: Record<number, string> = {
  [LAND_TYPE.MINERAL]: 'Mineral',
  [LAND_TYPE.ORGANIK]: 'Organik',
  [LAND_TYPE.LAHAN_BASAH]: 'Lahan Basah',
};
