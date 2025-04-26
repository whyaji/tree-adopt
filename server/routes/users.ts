import { Hono } from 'hono';

import { userSchema } from '../db/schema/schema.js';
import { getPaginationData } from '../lib/pagination.js';
import authMiddleware from '../middleware/jwt.js';

export const usersRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: userSchema,
      searchBy: 'name,email',
    });
  });
