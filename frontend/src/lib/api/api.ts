import { type ApiRoutes } from '@server/app';
import { hc } from 'hono/client';
import Cookies from 'js-cookie';

const authToken = Cookies.get('auth_token');

const client = hc<ApiRoutes>('/', {
  headers: {
    Authorization: authToken ? `Bearer ${authToken}` : '',
  },
});

export const api = client.api.v1;
export const baseUrl = window.location.origin;
export const baseApiUrl = baseUrl + '/api/v1';
