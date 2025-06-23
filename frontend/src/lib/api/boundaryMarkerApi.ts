import { PaginationParamsOptional } from '@/interface/pagination.interface';
import { BoundarymarkerCodeType } from '@/types/boundaryMarker.type';

import { api } from './api';

const boundaryMarkerApi = api['boundary-marker'];

export async function createBoundaryMarkerCode(
  boundaryMarkerCode: Omit<BoundarymarkerCodeType, 'id'>
) {
  const res = await boundaryMarkerApi['code'].$post({
    json: boundaryMarkerCode,
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

export async function getBoundaryMarkerCodes(paginationParams: PaginationParamsOptional) {
  const { withData, ...params } = paginationParams;
  const res = await boundaryMarkerApi['code'].$get({
    query: { ...params, with: withData },
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function getBoundaryMarkerCode(id: string, withData?: string) {
  const res = await boundaryMarkerApi['code'][':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: BoundarymarkerCodeType }>;
}

export async function updateBoundaryMarkerCodeById(
  boundaryMarkerCode: BoundarymarkerCodeType,
  id: string
) {
  const res = await boundaryMarkerApi['code'][':id{[0-9]+}'].$put({
    json: boundaryMarkerCode,
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

export async function deleteBoundaryMarkerCodeById(id: string) {
  const res = await boundaryMarkerApi['code'][':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
