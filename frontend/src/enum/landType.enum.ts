export enum LAND_TYPE {
  PEATLAND = 1,
}

export const LandTypeLabel: Record<number, string> = {
  [LAND_TYPE.PEATLAND]: 'Lahan Gambut',
};

export const ListLandType = [{ label: 'Lahan Gambut', value: String(LAND_TYPE.PEATLAND) }];
