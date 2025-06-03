import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../../db/database.js';
import { kelompokKomunitasSchema, userSchema } from '../../db/schema/schema.js';
import { boundaryMarkerCodeSchema } from '../../db/schema/schema.js'; // adjust import as needed
import { getDataBy } from '../../lib/dataBy.js';
import { getPaginationData } from '../../lib/pagination.js';
import type { RelationsType } from '../../lib/relation.js';
import authMiddleware from '../../middleware/jwt.js';

// === ZOD SCHEMAS ===
const boundaryMarkerCodeSchemaZod = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1),
  kelompokKomunitasId: z.number().int().positive(),
  status: z.number().int().optional(),
  taggedAt: z.string().optional(),
  taggedBy: z.number().int().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
});

const createBoundaryMarkerCodeSchema = boundaryMarkerCodeSchemaZod.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type BoundaryMarkerCode = z.infer<typeof boundaryMarkerCodeSchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  kelompokKomunitasId: {
    type: 'one-to-one',
    table: kelompokKomunitasSchema,
    on: 'id',
  },
  taggedBy: {
    type: 'one-to-one',
    table: userSchema,
    on: 'id',
    alias: 'marker',
  },
};

// === ROUTES ===
export const boundaryMarkerCodeRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: boundaryMarkerCodeSchema,
      searchBy: 'code',
      relations,
    });
  })

  .post('/', zValidator('json', createBoundaryMarkerCodeSchema), async (c) => {
    const boundaryMarkerCode = c.req.valid('json');
    await db.insert(boundaryMarkerCodeSchema).values(boundaryMarkerCode);
    return c.json({ message: 'Boundary marker code created' }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: boundaryMarkerCodeSchema });
  })

  .put('/:id{[0-9]+}', zValidator('json', createBoundaryMarkerCodeSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const boundaryMarkerCode = c.req.valid('json');
    const updated = await db
      .update(boundaryMarkerCodeSchema)
      .set(boundaryMarkerCode)
      .where(eq(boundaryMarkerCodeSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Boundary marker code updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db
      .delete(boundaryMarkerCodeSchema)
      .where(eq(boundaryMarkerCodeSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Boundary marker code deleted' });
  });
