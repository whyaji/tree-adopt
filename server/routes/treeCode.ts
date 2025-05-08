import { zValidator } from '@hono/zod-validator';
import { desc, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { kelompokKomunitasSchema, treeCodeSchema } from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const treeCodeSchemaZod = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1),
  kelompokKomunitasId: z.number().int().positive(),
  status: z.number().int().optional(),
});

const createTreeCodeSchema = treeCodeSchemaZod.omit({ id: true });
export type TreeCode = z.infer<typeof treeCodeSchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  kelompokKomunitasId: {
    type: 'one-to-one',
    table: kelompokKomunitasSchema,
    on: 'id',
  },
};

// === ROUTES ===
export const treeCodeRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({ c, table: treeCodeSchema, searchBy: 'code', relations });
  })

  .post('/', zValidator('json', createTreeCodeSchema), async (c) => {
    const treeCode = c.req.valid('json');
    await db.insert(treeCodeSchema).values(treeCode);
    return c.json({ message: 'Tree code created' }, 201);
  })

  .post('/generate-next-code', async (c) => {
    // payload is body raw json { kelompokKomunitasId: 1, size: 10 }
    const { kelompokKomunitasId, size } = await c.req.json<{
      kelompokKomunitasId: number;
      size: number;
    }>();

    // Check if size is valid
    if (size < 1 || size > 100) {
      return c.json({ message: 'Size must be between 1 and 100' }, 400);
    }

    // Check if kelompokKomunitasId is valid
    const kelompokKomunitas = await db.query.kelompokKomunitasSchema.findFirst({
      where: eq(kelompokKomunitasSchema.id, kelompokKomunitasId),
    });

    if (!kelompokKomunitas) {
      return c.json({ message: 'Kelompok Komunitas not found' }, 404);
    }

    const groupName = kelompokKomunitas.name.replace(/\s+/g, '-').toUpperCase();

    // EXAMPLE CODE: [tree letter group name first center last name leter]-[kelompokKomunitasId]-[number]
    // EXAMPLE CODE: HTK-1-1

    // Generate code based on the last code
    const midIndex = Math.floor(groupName.length / 2);
    const treeLetter =
      groupName.charAt(0).toUpperCase() +
      groupName.charAt(midIndex).toUpperCase() +
      groupName.charAt(groupName.length - 1).toUpperCase();

    // Get the last code for the kelompokKomunitasId
    const lastCode = await db.query.treeCodeSchema.findFirst({
      where: eq(treeCodeSchema.kelompokKomunitasId, kelompokKomunitasId),
      orderBy: desc(treeCodeSchema.createdAt),
    });

    const lastCodeNumber = lastCode ? parseInt(lastCode.code.split('-')[2]) : 1;
    const newCodes: {
      code: string;
      kelompokKomunitasId: number;
    }[] = [];
    for (let i = 1; i <= size; i++) {
      const newCodeNumber = lastCodeNumber + i;
      const newCode = `${treeLetter}-${kelompokKomunitasId}-${newCodeNumber}`;
      newCodes.push({
        code: newCode,
        kelompokKomunitasId: kelompokKomunitasId,
      });
    }

    // Insert the new codes into the database
    try {
      await db.insert(treeCodeSchema).values(newCodes);
    } catch (error) {
      console.error('Error inserting new tree codes:', error);
      return c.json({ error: 'Failed to generate tree codes' }, 500);
    }
    return c.json({ message: 'Tree codes generated', codes: newCodes }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: treeCodeSchema });
  })

  .put('/:id{[0-9]+}', zValidator('json', treeCodeSchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const treeCode = c.req.valid('json');
    const updated = await db.update(treeCodeSchema).set(treeCode).where(eq(treeCodeSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Tree code updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(treeCodeSchema).where(eq(treeCodeSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Tree code deleted' });
  });
