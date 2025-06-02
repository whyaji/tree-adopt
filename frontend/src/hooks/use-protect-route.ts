import { useNavigate } from '@tanstack/react-router';

import { useUserStore } from '@/lib/stores/userStore';

export function useProtectRoute(perms: string[], idCheck?: string, availableIds?: string[]) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const permissions = user?.permissions ?? [];
  console.log('permissions', permissions);
  if (perms.length > 0 && !permissions.some((perm) => perms.includes(perm))) {
    navigate({ to: '/not-authorized', replace: true });
  }

  if (idCheck && availableIds && !availableIds.includes(idCheck)) {
    navigate({ to: '/not-found', replace: true });
  }
}
