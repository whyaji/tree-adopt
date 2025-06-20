import { PaginationParams } from '@/interface/pagination.interface';
import { UserType } from '@/types/user.type';

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

export async function createUser(user: {
  password: string;
  name: string;
  email: string;
  groupId?: number;
  role?: number;
}) {
  const res = await userApi.$post({
    json: user,
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
  return (await res.json()) as unknown as {
    message: string;
    data: {
      userId: number;
    };
  };
}

export async function getUser(id: string, withData?: string) {
  const res = await userApi[':id{[0-9]+}'].$get({
    param: { id },
    ...(withData ? { query: { with: withData } } : {}),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: UserType }>;
}

export async function updateUser(user: {
  id: number;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role?: number; // 0 = admin, 1 = user
  groupId?: number;
}) {
  const res = await userApi[':id{[0-9]+}'].$put({
    json: user,
    param: { id: user.id.toString() },
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
  return (await res.json()) as unknown as {
    message: string;
    data: {
      userId: number;
    };
  };
}

export async function deleteUser(id: string) {
  const res = await userApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function saveUserRoles(userId: number, roleIds: number[]) {
  const res = await userApi[':id{[0-9]+}']['save-roles'].$post({
    json: { roleIds },
    param: { id: userId.toString() },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
