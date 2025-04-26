import { PaginationParams } from '@/interface/pagination.interface';

import { api } from './api';

const userApi = api['users'];

export async function getUsers({
  search,
  page,
  limit,
  filter,
  withData,
  sortBy,
  order,
}: PaginationParams) {
  const res = await userApi.$get({
    query: { search, page, limit, with: withData, filter, sortBy, order },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
