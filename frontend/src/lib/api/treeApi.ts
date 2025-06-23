import { Tree } from '@server/routes/tree';

import { PaginationParams } from '@/interface/pagination.interface';
import { TreeType } from '@/types/tree.type';

import { api } from './api';

const treeApi = api['tree'];

export async function createTree(tree: Omit<Tree, 'id'>) {
  const res = await treeApi.$post({
    json: tree,
  });
  if (!res.ok)
    return (await res.json()) as unknown as {
      success: boolean;
      error: {
        issues: {
          code: string;
          message: string;
          path: string[];
        }[];
      };
    };
  return await res.json();
}

export async function getTrees(paginationParams: PaginationParams) {
  const { withData, ...params } = paginationParams;
  const res = await treeApi.$get({
    query: { ...params, with: withData },
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function getTree(id: string, withData?: string) {
  const res = await treeApi[':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: TreeType }>;
}

export async function updateTree(tree: Tree) {
  const res = await treeApi[':id{[0-9]+}'].$put({
    json: tree,
    param: { id: tree.id.toString() },
  });
  if (!res.ok)
    return (await res.json()) as unknown as {
      success: boolean;
      error: {
        issues: {
          code: string;
          message: string;
          path: string[];
        }[];
      };
    };
  return await res.json();
}

export async function deleteTree(id: string) {
  const res = await treeApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
