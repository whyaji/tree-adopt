import { KelompokKomunitas } from '@server/routes/kelompokkomunitas';
import Cookies from 'js-cookie';

import { PaginationParams } from '@/interface/pagination.interface';

import { api, baseApiUrl } from './api';

const kelompokKomunitasApi = api['kelompok-komunitas'];

const authToken = Cookies.get('auth_token');

export async function createKelompokKomunitas(formData: FormData) {
  const res = await fetch(`${baseApiUrl}/kelompok-komunitas`, {
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

export async function getKelompokKomunitas({
  search,
  page,
  limit,
  filter,
  withData,
  sortBy,
  order,
}: PaginationParams) {
  const res = await kelompokKomunitasApi.$get({
    query: { search, page, limit, with: withData, filter, sortBy, order },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getKelompokKomunitasById(id: string, withData?: string) {
  const res = await kelompokKomunitasApi[':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: KelompokKomunitas }>;
}

export async function getKelompokKomunitasByName(name: string, withData?: string) {
  const res = await kelompokKomunitasApi['by-name'][':name'].$get({
    param: { name },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: KelompokKomunitas }>;
}

export async function updateKelompokKomunitas(id: number, formData: FormData) {
  const res = await fetch(`${baseApiUrl}/kelompok-komunitas/${id}`, {
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

export async function deleteKelompokKomunitas(id: string) {
  const res = await kelompokKomunitasApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function updateGroupCoordinateAreas(
  id: string,
  groupCoordinateArea: {
    id?: number;
    coordinates: [number, number][];
    status: 'create' | 'update' | 'delete';
  }[]
) {
  const res = await kelompokKomunitasApi[':id{[0-9]+}']['update-group-coordinate-area'].$post({
    json: groupCoordinateArea,
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
