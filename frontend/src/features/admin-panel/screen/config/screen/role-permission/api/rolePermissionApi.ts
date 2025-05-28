import { PaginationParams } from '@/interface/pagination.interface';
import { api } from '@/lib/api/api';
import { PermissionType } from '@/types/permission.type';
import { RoleType } from '@/types/role.type';

const permissionsApi = api['permissions'];
const rolesApi = api['roles'];

export async function getPermissions({
  search,
  page,
  limit,
  filter,
  withData,
  sortBy,
  order,
}: PaginationParams) {
  const res = await permissionsApi.$get({
    query: { search, page, limit, with: withData, filter, sortBy, order },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function createPermission(
  permission: Omit<PermissionType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'permissions'>
) {
  const res = await permissionsApi.$post({
    json: permission,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function updatePermission(
  permission: Omit<PermissionType, 'createdAt' | 'updatedAt' | 'deletedAt' | 'permissions'>
) {
  const res = await permissionsApi[':id{[0-9]+}'].$put({
    json: permission,
    param: { id: permission.id.toString() },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deletePermission(id: string) {
  const res = await permissionsApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function getRoles({
  search,
  page,
  limit,
  filter,
  withData,
  sortBy,
  order,
}: PaginationParams) {
  const res = await rolesApi.$get({
    query: { search, page, limit, with: withData, filter, sortBy, order },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function createRole(
  role: Omit<RoleType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'permissions'>
) {
  const res = await rolesApi.$post({
    json: role,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function updateRole(
  role: Omit<RoleType, 'createdAt' | 'updatedAt' | 'deletedAt' | 'permissions'>
) {
  const res = await rolesApi[':id{[0-9]+}'].$put({
    json: role,
    param: { id: role.id.toString() },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function deleteRole(id: string) {
  const res = await rolesApi[':id{[0-9]+}'].$delete({
    param: { id },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function saveRolePermissions(roleId: number, permissionIds: number[]) {
  const res = await rolesApi[':id{[0-9]+}']['save-permissions'].$post({
    json: { permissionIds },
    param: { id: roleId.toString() },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
