import Cookies from 'js-cookie';

import { PaginationParamsOptional } from '@/interface/pagination.interface';
import {
  BoundarymarkerCodeType,
  BoundaryMarkerType,
  CheckBmHistoryType,
} from '@/types/boundaryMarker.type';

import { api, baseApiUrl } from './api';

const boundaryMarkerApi = api['boundary-marker'];

// Boundary Marker API functions
export async function createBoundaryMarker(
  boundaryMarker: Omit<BoundaryMarkerType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
) {
  const res = await boundaryMarkerApi.$post({
    json: boundaryMarker,
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

export async function getBoundaryMarkers(paginationParams: PaginationParamsOptional) {
  const { withData, ...params } = paginationParams;
  const res = await boundaryMarkerApi.$get({
    query: { ...params, with: withData },
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function getBoundaryMarker(id: string, withData?: string) {
  const res = await boundaryMarkerApi[':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: BoundaryMarkerType }>;
}

export async function updateBoundaryMarkerById(
  boundaryMarker: Omit<BoundaryMarkerType, 'createdAt' | 'updatedAt' | 'deletedAt'>,
  id: string
) {
  const res = await boundaryMarkerApi[':id{[0-9]+}'].$put({
    json: boundaryMarker,
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

export async function deleteBoundaryMarkerById(id: string) {
  const res = await boundaryMarkerApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

// Boundary Marker Code API functions
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

// Boundary Marker Check History API functions
const authToken = Cookies.get('auth_token');

export async function createBoundaryMarkerCheckHistory(formData: FormData) {
  const res = await fetch(`${baseApiUrl}/boundary-marker/check-history`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
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

export async function updateBoundaryMarkerCheckHistory(id: number, formData: FormData) {
  const res = await fetch(`${baseApiUrl}/boundary-marker/check-history/${id}`, {
    method: 'PUT',
    body: formData,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
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

export async function getBoundaryMarkerCheckHistories(paginationParams: PaginationParamsOptional) {
  const { withData, ...params } = paginationParams;
  const res = await boundaryMarkerApi['check-history'].$get({
    query: { ...params, with: withData },
  });
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export async function getBoundaryMarkerCheckHistory(id: string, withData?: string) {
  const res = await boundaryMarkerApi['check-history'][':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: CheckBmHistoryType }>;
}

export async function deleteBoundaryMarkerCheckHistoryById(id: string) {
  const res = await boundaryMarkerApi['check-history'][':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
