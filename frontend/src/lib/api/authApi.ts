import { queryOptions } from '@tanstack/react-query';

import api from './api';

export async function getCurrentUser() {
  const res = await api.profile.$get();
  if (!res.ok) {
    throw new Error('server error');
  }
  return res.json();
}

export const userQueryOptions = queryOptions({
  queryKey: ['get-current-user'],
  queryFn: getCurrentUser,
  staleTime: Infinity,
});

export const login = async (email: string, password: string) => {
  const res = await api.login.$post({ json: { email, password } });
  if (!res.ok) {
    throw new Error('invalid email or password');
  }
  return res.json();
};

export const register = async (name: string, email: string, password: string) => {
  const res = await api.register.$post({ json: { name, email, password } });
  if (!res.ok) {
    throw new Error('email already exists or invalid data');
  }
  return res.json();
};
