import Cookies from 'js-cookie';

import { PaginationParams, PaginationResponse } from '@/interface/pagination.interface';
import { GroupActivityType } from '@/types/groupActivity.type';

import { api, baseApiUrl } from './api';

const groupActivityApi = api['group-activity'];

const authToken = Cookies.get('auth_token');

export async function createGroupActivity(formData: FormData) {
  const res = await fetch(`${baseApiUrl}/group-activity`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getGroupActivities(paginationParams: PaginationParams) {
  const { withData, ...params } = paginationParams;
  const res = await groupActivityApi.$get({
    query: { with: withData, ...params },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<PaginationResponse<GroupActivityType>>;
}

export async function getGroupActivityImages({
  search,
  page,
  limit,
  filter,
  withData,
  sortBy,
  order,
}: PaginationParams) {
  const res = await groupActivityApi['images'].$get({
    query: { search, page, limit, with: withData, filter, sortBy, order },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getGroupActivity(id: string, withData?: string) {
  const res = await groupActivityApi[':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: GroupActivityType }>;
}

export async function updateGroupActivity(id: number, formData: FormData) {
  const res = await fetch(`${baseApiUrl}/group-activity/${id}`, {
    method: 'PUT',
    body: formData,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteGroupActivity(id: string) {
  const res = await groupActivityApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
