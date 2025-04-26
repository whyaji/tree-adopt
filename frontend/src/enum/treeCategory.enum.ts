export enum TREE_CATEGORY {
  POHON_DEWASA = 1,
  POHON_REMAJA = 2,
  BIBIT = 3,
}

export const TreeCategoryLabel: Record<number, string> = {
  [TREE_CATEGORY.POHON_DEWASA]: 'Pohon Dewasa',
  [TREE_CATEGORY.POHON_REMAJA]: 'Pohon Remaja',
  [TREE_CATEGORY.BIBIT]: 'Bibit',
};

export const ListTreeCategory = [
  { label: 'Pohon Dewasa', value: String(TREE_CATEGORY.POHON_DEWASA) },
  { label: 'Pohon Remaja', value: String(TREE_CATEGORY.POHON_REMAJA) },
  { label: 'Bibit', value: String(TREE_CATEGORY.BIBIT) },
];
