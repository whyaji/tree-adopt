import { KelompokKomunitas } from '@server/routes/kelompokkomunitas';

import api from './api';

const kelompokKomunitasApi = api['kelompok-komunitas'];

export async function createKelompokKomunitas(kelompokKomunitas: Omit<KelompokKomunitas, 'id'>) {
  const res = await kelompokKomunitasApi.$post({
    json: kelompokKomunitas,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getKelompokKomunitas(search: string, page: number, limit: number) {
  const res = await kelompokKomunitasApi.$get({
    query: { search, page, limit },
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

export async function updateKelompokKomunitas(kelompokKomunitas: KelompokKomunitas) {
  const res = await kelompokKomunitasApi[':id{[0-9]+}'].$put({
    json: kelompokKomunitas,
    param: { id: kelompokKomunitas.id.toString() },
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
