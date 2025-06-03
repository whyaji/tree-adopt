import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../../db/database.js';
import {
  boundaryMarkerSchema,
  kelompokKomunitasSchema,
  userSchema,
} from '../../db/schema/schema.js';
import { getDataBy } from '../../lib/dataBy.js';
import { getPaginationData } from '../../lib/pagination.js';
import type { RelationsType } from '../../lib/relation.js';
import authMiddleware from '../../middleware/jwt.js';

// === ZOD SCHEMAS ===
const boundaryMarkerSchemaZod = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1),
  kelompokKomunitasId: z.number().int().positive(),
  checkerId: z.number().int().positive(),
  installYear: z.number().int(),
  latitude: z.number(),
  longitude: z.number(),
  description: z.string().optional(),
  status: z.number().int().default(1), // 0 = inactive, 1 = active
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().nullable().optional(),
});

const createBoundaryMarkerSchema = boundaryMarkerSchemaZod.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type BoundaryMarker = z.infer<typeof boundaryMarkerSchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  checkerId: {
    type: 'one-to-one',
    table: userSchema,
    on: 'id',
  },
  kelompokKomunitasId: {
    type: 'one-to-one',
    table: kelompokKomunitasSchema,
    on: 'id',
  },
};

// === ROUTES ===
export const boundaryMarkerRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: boundaryMarkerSchema,
      searchBy: 'code,kelompokKomunitasId,installYear,description',
      relations,
    });
  })

  .post('/', zValidator('json', createBoundaryMarkerSchema), async (c) => {
    const marker = c.req.valid('json');
    await db.insert(boundaryMarkerSchema).values(marker);
    return c.json({ message: 'Boundary marker created' }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: boundaryMarkerSchema, relations });
  })

  .put('/:id{[0-9]+}', zValidator('json', createBoundaryMarkerSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const marker = c.req.valid('json');
    const updated = await db
      .update(boundaryMarkerSchema)
      .set(marker)
      .where(eq(boundaryMarkerSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Boundary marker updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(boundaryMarkerSchema).where(eq(boundaryMarkerSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Boundary marker deleted' });
  });
