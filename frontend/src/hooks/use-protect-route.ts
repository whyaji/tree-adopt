import { useUserStore } from '@/lib/stores/userStore';

export function useProtectRoute(perms: string[], idCheck?: string, availableIds?: string[]) {
  const user = useUserStore((state) => state.user);
  const permissions = user?.permissions ?? [];
  if (
    (perms.length > 0 && !permissions.some((perm) => perms.includes(perm))) ||
    (idCheck && availableIds && !availableIds.includes(idCheck))
  ) {
    window.location.replace('/not-found');
  }
}
