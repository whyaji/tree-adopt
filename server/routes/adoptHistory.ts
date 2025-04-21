import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { adoptHistorySchema } from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const adoptHistorySchemaZod = z.object({
  id: z.number().int().positive(),
  treeId: z.number().int().positive(),
  userId: z.number().int().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

const createAdoptHistory = adoptHistorySchemaZod.omit({ id: true });
export type AdoptHistory = z.infer<typeof adoptHistorySchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  treeId: {
    type: 'one-to-one',
    table: adoptHistorySchema,
    on: 'id',
  },
  userId: {
    type: 'one-to-one',
    table: adoptHistorySchema,
    on: 'id',
  },
};

// === ROUTES ===
export const adoptHistoryRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: adoptHistorySchema,
      searchBy: 'latinName,localName',
      relations,
    });
  })

  .post('/', zValidator('json', createAdoptHistory), async (c) => {
    const adoptHistory = c.req.valid('json');
    await db.insert(adoptHistorySchema).values(adoptHistory);
    return c.json({ message: 'Tree created' }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: adoptHistorySchema, relations });
  })

  .put('/:id{[0-9]+}', zValidator('json', adoptHistorySchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const adoptHistory = c.req.valid('json');
    const updated = await db
      .update(adoptHistorySchema)
      .set(adoptHistory)
      .where(eq(adoptHistorySchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Tree updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(adoptHistorySchema).where(eq(adoptHistorySchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Tree deleted' });
  });
