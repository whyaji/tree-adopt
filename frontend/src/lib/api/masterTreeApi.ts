import { PaginationParams, PaginationParamsOptional } from '@/interface/pagination.interface';
import { MasterLocalTreeType, MasterTreeType } from '@/types/masterTree.type';

import { api } from './api';

const masterTreeApi = api['master-tree'];

export async function createMasterTree(masterTree: Omit<MasterTreeType, 'id'>) {
  const res = await masterTreeApi.$post({
    json: masterTree,
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

export async function getMasterTrees({
  search,
  page,
  limit,
  filter,
  withData,
  sortBy,
  order,
}: PaginationParams) {
  const res = await masterTreeApi['actual'].$get({
    query: { search, page, limit, with: withData, filter, sortBy, order },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getMasterTree(id: string, withData?: string) {
  const res = await masterTreeApi[':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: MasterTreeType }>;
}

export async function updateMasterTree(masterTree: MasterTreeType) {
  const res = await masterTreeApi[':id{[0-9]+}'].$put({
    json: masterTree,
    param: { id: masterTree.id.toString() },
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

export async function deleteMasterTree(id: string) {
  const res = await masterTreeApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function createMasterTreeLocal(localTree: {
  localName: string;
  masterTreeId: number;
}) {
  const res = await masterTreeApi['local'].$post({
    json: localTree,
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

export async function getMasterTreeLocals(paginationParams: PaginationParamsOptional) {
  const { withData, ...params } = paginationParams;
  const res = await masterTreeApi['local'].$get({
    query: { ...params, with: withData },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getMasterTreeLocal(id: string, withData?: string) {
  const res = await masterTreeApi['local'][':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: MasterLocalTreeType }>;
}

export async function updateMasterTreeLocalById(
  localTree: { id: number; localName: string; masterTreeId: number },
  id: string
) {
  const res = await masterTreeApi['local'][':id{[0-9]+}'].$put({
    json: localTree,
    param: { id },
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

export async function deleteMasterTreeLocal(id: string) {
  const res = await masterTreeApi['local'][':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
