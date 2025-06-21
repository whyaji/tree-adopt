import { PaginationParams } from '@/interface/pagination.interface';
import { MasterTreeType } from '@/types/masterTree.type';

import { api } from './api';

const masterTreeApi = api['master-tree'];

export async function createMasterTree(masterTree: Omit<MasterTreeType, 'id'>) {
  const res = await masterTreeApi.$post({
    json: masterTree,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getMasterTrees({
  search,
  page,
  limit,
  filter,
  withData,
  sortBy,
  order,
}: PaginationParams) {
  const res = await masterTreeApi.$get({
    query: { search, page, limit, with: withData, filter, sortBy, order },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getMasterTree(id: string) {
  const res = await masterTreeApi[':id{[0-9]+}'].$get({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: MasterTreeType }>;
}

export async function updateMasterTree(masterTree: MasterTreeType) {
  const res = await masterTreeApi[':id{[0-9]+}'].$put({
    json: masterTree,
    param: { id: masterTree.id.toString() },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function updateMasterTreeLocal(
  id: string,
  localTrees: {
    id?: number; // optional for create, required for update/delete
    localName: string;
    status: 'create' | 'update' | 'delete';
  }[]
) {
  const res = await masterTreeApi[':id{[0-9]+}']['update-local'].$post({
    json: localTrees,
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteMasterTree(id: string) {
  const res = await masterTreeApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
