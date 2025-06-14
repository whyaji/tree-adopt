export enum TREE_CATEGORY {
  TREE = 1,
  POLE = 2,
}

export const TreeCategoryLabel: Record<number, string> = {
  [TREE_CATEGORY.TREE]: 'Pohon',
  [TREE_CATEGORY.POLE]: 'Tiang',
};

export const ListTreeCategory = [
  { label: 'Pohon', value: String(TREE_CATEGORY.TREE) },
  { label: 'Tiang', value: String(TREE_CATEGORY.POLE) },
];
