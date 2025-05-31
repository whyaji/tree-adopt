export const checkPermission = (
  userPermissions: string[],
  permission: string | string[]
): boolean => {
  if (!userPermissions || userPermissions.length === 0) {
    return false;
  }

  if (typeof permission === 'string') {
    return userPermissions.includes(permission);
  }

  if (Array.isArray(permission)) {
    return permission.some((perm) => userPermissions.includes(perm));
  }

  return false;
};
