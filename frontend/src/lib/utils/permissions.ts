import { UseNavigateResult } from '@tanstack/react-router';
export const checkPermission = (userPermissions: string[], permission: string[]): boolean => {
  if ((!userPermissions || userPermissions.length === 0) && permission.length > 0) {
    return false;
  }
  return permission.some((perm) => userPermissions.includes(perm));
};

export const checkPermissionWithLevel = (
  userPermissions: string[],
  globalPermission: string[],
  groupPermission?: string[],
  id?: string,
  availableIds?: string[]
): boolean => {
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }

  if (checkPermission(userPermissions, globalPermission)) {
    return true;
  }

  if (groupPermission && id && availableIds?.includes(id)) {
    return checkPermission(userPermissions, groupPermission);
  }

  return false;
};

export const checkPermissionWithLevelAndGoToNotAuthorized = (
  navigate: UseNavigateResult<string>,
  userPermissions: string[],
  globalPermission: string[],
  groupPermission?: string[],
  id?: string,
  availableIds?: string[]
) => {
  if (
    !checkPermissionWithLevel(userPermissions, globalPermission, groupPermission, id, availableIds)
  ) {
    navigate({ to: '/not-authorized', replace: true });
    return false;
  }
  return true;
};
