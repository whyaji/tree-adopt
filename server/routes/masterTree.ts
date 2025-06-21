import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { masterLocalTreeSchema, masterTreeSchema } from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const masterTreeSchemaZod = z.object({
  id: z.number().int().positive(),
  latinName: z.string().min(1),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const masterLocalTreeSchemaZod = z.object({
  id: z.number().int().positive(),
  masterTreeId: z.number().int().positive(),
  localName: z.string().min(1),
});

const createMasterTreeSchema = masterTreeSchemaZod.omit({ id: true });
const updateMasterTreeLocalSchema = z.array(
  z.object({
    id: z.number().int().positive().optional(),
    localName: z.string().min(1),
    status: z.enum(['create', 'update', 'delete']),
  })
);
export type MasterTree = z.infer<typeof masterTreeSchemaZod>;
export type MasterLocalTree = z.infer<typeof masterLocalTreeSchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  masterLocalTree: {
    type: 'one-to-many',
    table: masterLocalTreeSchema,
    on: 'masterTreeId',
  },
};

const relationsLocal: RelationsType = {
  masterTreeId: {
    type: 'one-to-one',
    table: masterTreeSchema,
    on: 'id',
  },
};
// === ROUTES ===
export const masterTreeRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: masterTreeSchema,
      searchBy: 'latinName',
      relations,
    });
  })

  .post('/', zValidator('json', createMasterTreeSchema), async (c) => {
    const tree = c.req.valid('json');
    const created = await db.insert(masterTreeSchema).values(tree);
    return c.json({ message: 'Tree created', masterTreeId: created[0].insertId }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: masterTreeSchema, relations });
  })

  .put('/:id{[0-9]+}', zValidator('json', masterTreeSchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const masterTree = c.req.valid('json');
    const updated = await db
      .update(masterTreeSchema)
      .set(masterTree)
      .where(eq(masterTreeSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Tree updated', masterTreeId: id });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(masterTreeSchema).where(eq(masterTreeSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Tree deleted' });
  })

  .post('/:id{[0-9]+}/update-local', zValidator('json', updateMasterTreeLocalSchema), async (c) => {
    const id = parseInt(c.req.param('id'));

    // body is an array of local trees with status 1: create, 2: update, 3: delete
    const localTrees = c.req.valid('json');

    // process each local tree based on status
    for (const localTree of localTrees) {
      if (localTree.status === 'create') {
        // create
        await db.insert(masterLocalTreeSchema).values({
          localName: localTree.localName,
          masterTreeId: id,
        });
      } else if (localTree.status === 'update' && localTree.id) {
        // update
        await db
          .update(masterLocalTreeSchema)
          .set({ localName: localTree.localName })
          .where(eq(masterLocalTreeSchema.id, localTree.id));
      } else if (localTree.status === 'delete' && localTree.id) {
        // delete
        await db.delete(masterLocalTreeSchema).where(eq(masterLocalTreeSchema.id, localTree.id));
      }
    }
    return c.json({ message: 'Local trees updated successfully' });
  })

  .get('local', async (c) => {
    return await getPaginationData({
      c,
      table: masterLocalTreeSchema,
      searchBy: 'localName',
      relations: relationsLocal,
    });
  });
