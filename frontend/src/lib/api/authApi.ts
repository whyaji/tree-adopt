import { queryOptions } from '@tanstack/react-query';

import { UserType } from '@/types/user.type';

import { api, baseApiUrl } from './api';

export async function getCurrentUser() {
  const res = await api.profile.$get();
  if (!res.ok) {
    throw new Error('server error');
  }
  return res.json();
}

export async function getCurrentUserWithToken(authToken: string) {
  const res = await fetch(`${baseApiUrl}/profile`, {
    method: 'GET',
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : '',
    },
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json() as Promise<{ data: UserType }>;
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export const login = async (email: string, password: string, recaptchaToken: string) => {
  const res = await api['login-with-recaptcha'].$post({
    json: { email, password, recaptchaToken },
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
  return await res.json();
};

export const register = async (
  name: string,
  email: string,
  password: string,
  recaptchaToken: string
) => {
  const res = await api.register.$post({ json: { name, email, password, recaptchaToken } });
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
  return await res.json();
};
