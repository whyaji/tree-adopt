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
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
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

export async function getKelompokKomunitasById(id: string) {
  const res = await kelompokKomunitasApi[':id{[0-9]+}'].$get({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: KelompokKomunitas }>;
}

export async function getKelompokKomunitasByName(name: string) {
  const res = await kelompokKomunitasApi.$get({
    query: { search: undefined, page: 1, limit: 1, filter: `name:${name}:eq` },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function updateKelompokKomunitas(id: number, formData: FormData) {
  const res = await fetch(`${baseApiUrl}/kelompok-komunitas/${id}`, {
    method: 'PUT',
    body: formData,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteKelompokKomunitas(id: string) {
  const res = await kelompokKomunitasApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
