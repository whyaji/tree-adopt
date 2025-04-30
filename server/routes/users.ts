import { Hono } from 'hono';

import { kelompokKomunitasSchema, userSchema } from '../db/schema/schema.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';

// === RELATIONS ===
const relations: RelationsType = {
  groupId: {
    type: 'one-to-one',
    table: kelompokKomunitasSchema,
    on: 'id',
  },
};

export const usersRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: userSchema,
      searchBy: 'name,email',
      relations,
    });
  });
