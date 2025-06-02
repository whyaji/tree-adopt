import { useUserStore } from '@/lib/stores/userStore';

export function useCheckPermission(perms: string[]) {
  const user = useUserStore((state) => state.user);
  const permissions = user?.permissions ?? [];
  if (perms.length > 0 && !permissions.some((perm) => perms.includes(perm))) {
    return false;
  }
  return true;
}
