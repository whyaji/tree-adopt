import { type ApiRoutes } from '@server/app';
import { hc } from 'hono/client';
import Cookies from 'js-cookie';

const authToken = Cookies.get('auth_token');

const client = hc<ApiRoutes>('/', {
  headers: {
    Authorization: authToken ? `Bearer ${authToken}` : '',
  },
});

const api = client.api.v1;

export default api;
