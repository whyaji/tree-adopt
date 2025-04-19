import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import {
  kelompokKomunitasSchema,
  masterTreeSchema,
  treeSchema,
  userSchema,
} from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const treeSchemaZod = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1),
  treeId: z.number().int().positive(),
  kelompokKomunitasId: z.number().int().positive(),
  status: z.number().int().default(1), // 0 = inactive, 1 = active, 2 = adopted
  adoptedBy: z.number().int().nullable(),
  category: z.number().int().positive(), // 1 = pohon dewasa, 2 = pohon remaja, 3 = bibit
  diameter: z.number().positive(),
  serapanCo2: z.number().positive(),
  landType: z.number().int().positive(),
});

const createTreeSchema = treeSchemaZod.omit({ id: true, status: true, adoptedBy: true });
export type Tree = z.infer<typeof treeSchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  adoptedBy: {
    type: 'one-to-one',
    table: userSchema,
    on: 'id',
  },
  kelompokKomunitasId: {
    type: 'one-to-one',
    table: kelompokKomunitasSchema,
    on: 'id',
  },
  treeId: {
    type: 'one-to-one',
    table: masterTreeSchema,
    on: 'id',
  },
};

// === ROUTES ===
export const treeRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: treeSchema,
      searchBy: 'code,kelompokKomunitasId',
      relations,
    });
  })

  .post('/', zValidator('json', createTreeSchema), async (c) => {
    const tree = c.req.valid('json');
    await db.insert(treeSchema).values(tree);
    return c.json({ message: 'Tree created' }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: treeSchema, relations });
  })

  .put('/:id{[0-9]+}', zValidator('json', treeSchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const tree = c.req.valid('json');
    const updated = await db.update(treeSchema).set(tree).where(eq(treeSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Tree updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(treeSchema).where(eq(treeSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Tree deleted' });
  });
