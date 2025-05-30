import { createFileRoute, Outlet } from '@tanstack/react-router';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { ROLE } from '@/enum/role.enum';
import { userQueryOptions } from '@/lib/api/authApi';
import { useUserStore } from '@/lib/stores/userStore';

const Onboard = () => {
  return (
    <div className="flex flex-col gap-y-2 items-center mt-6">
      <p>You have to login or register</p>
      <Button asChild>
        <a href="/login">Login!</a>
      </Button>
      <Button asChild>
        <a href="/register">Register!</a>
      </Button>
    </div>
  );
};

const Component = () => {
  const { user } = Route.useRouteContext();
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  if (!user) {
    clearUser();
    Cookies.remove('auth_token');
    Cookies.remove('user');
    return <Onboard />;
  }

  setUser(user.data);

  if (user.data.role !== ROLE.ADMIN) {
    return <Onboard />;
  }

  return <Outlet />;
};

export const Route = createFileRoute('/_authenticated_admin')({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient;

    try {
      const data = await queryClient.fetchQuery(userQueryOptions);
      if (!data) {
        return { user: null };
      } else {
        Cookies.set('user', JSON.stringify(data.data));
      }
      return { user: data };
    } catch {
      return { user: null };
    }
  },
  component: Component,
});
