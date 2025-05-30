import { useNavigate } from '@tanstack/react-router';

import { useUserStore } from '@/lib/stores/userStore';

export function useProtectRoute(perms: string[]) {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const permissions = user?.permissions ?? [];
  if (!permissions.some((perm) => perms.includes(perm))) {
    navigate({ to: '/not-authorized', replace: true });
  }
}
