export enum LAND_COVER {
  SWAMP = 1,
  KERANGAS = 2,
  DRY_LAND = 3,
  MANGROVE = 4,
  SHRUB = 5,
  INDUSTRIAL_PLANTATION = 6,
  PLANTATION = 7,
  OPEN_LAND = 8,
}

export const LandCoverLabel: Record<number, string> = {
  [LAND_COVER.SWAMP]: 'Hutan Rawa',
  [LAND_COVER.KERANGAS]: 'Hutan Kerangas',
  [LAND_COVER.DRY_LAND]: 'Hutan Lahan Kering',
  [LAND_COVER.MANGROVE]: 'Hutan Mangrove',
  [LAND_COVER.SHRUB]: 'Semak Belukar',
  [LAND_COVER.INDUSTRIAL_PLANTATION]: 'Hutan Tanaman Industri (HTI)',
  [LAND_COVER.PLANTATION]: 'Perkebunan',
  [LAND_COVER.OPEN_LAND]: 'Tanah Terbuka',
};

export const ListLandCover = [
  { label: 'Hutan Rawa', value: String(LAND_COVER.SWAMP) },
  { label: 'Hutan Kerangas', value: String(LAND_COVER.KERANGAS) },
  { label: 'Hutan Lahan Kering', value: String(LAND_COVER.DRY_LAND) },
  { label: 'Hutan Mangrove', value: String(LAND_COVER.MANGROVE) },
  { label: 'Semak Belukar', value: String(LAND_COVER.SHRUB) },
  { label: 'Hutan Tanaman Industri (HTI)', value: String(LAND_COVER.INDUSTRIAL_PLANTATION) },
  { label: 'Perkebunan', value: String(LAND_COVER.PLANTATION) },
  { label: 'Tanah Terbuka', value: String(LAND_COVER.OPEN_LAND) },
];
