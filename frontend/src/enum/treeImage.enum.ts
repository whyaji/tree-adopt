export enum TREE_IMAGE {
  TREE_IMAGE = 'tree_image',
  LEAF_IMAGE = 'leaf_image',
  SKIN_IMAGE = 'skin_image',
  FRUIT_IMAGE = 'fruit_image',
  FLOWER_IMAGE = 'flower_image',
  SAP_IMAGE = 'sap_image',
  OTHER_IMAGE = 'other_image',
}

export const TreeImageLabels: Record<TREE_IMAGE, string> = {
  [TREE_IMAGE.TREE_IMAGE]: 'Gambar Pohon',
  [TREE_IMAGE.LEAF_IMAGE]: 'Gambar Daun',
  [TREE_IMAGE.SKIN_IMAGE]: 'Gambar Kulit Batang',
  [TREE_IMAGE.FRUIT_IMAGE]: 'Gambar Buah',
  [TREE_IMAGE.FLOWER_IMAGE]: 'Gambar Bunga',
  [TREE_IMAGE.SAP_IMAGE]: 'Gambar Getah',
  [TREE_IMAGE.OTHER_IMAGE]: 'Gambar Lainnya',
};

export const ListTreeImage = Object.entries(TREE_IMAGE).map(([value]) => ({
  label: TreeImageLabels[TREE_IMAGE[value as keyof typeof TREE_IMAGE]],
  value: TREE_IMAGE[value as keyof typeof TREE_IMAGE],
}));
