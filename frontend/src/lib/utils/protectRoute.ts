import Cookies from 'js-cookie';

export function protectRoute(perm: string) {
  const userString = Cookies.get('user');
  const user = userString ? JSON.parse(userString) : null;
  const permissions = user?.permissions ?? [];
  if (!permissions.includes(perm)) {
    window.location.href = '/not-authorized';
  }
}
