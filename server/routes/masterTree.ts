import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { masterTreeSchema } from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const masterTreeSchemaZod = z.object({
  id: z.number().int().positive(),
  latinName: z.string().min(1),
  localName: z.string().min(1),
});

const createMasterTreeSchema = masterTreeSchemaZod.omit({ id: true });
export type MasterTree = z.infer<typeof masterTreeSchemaZod>;

// === ROUTES ===
export const masterTreeRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData(c, masterTreeSchema, 'latinName,localName');
  })

  .post('/', zValidator('json', createMasterTreeSchema), async (c) => {
    const tree = c.req.valid('json');
    await db.insert(masterTreeSchema).values(tree);
    return c.json({ message: 'Tree created' }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy(c, masterTreeSchema);
  })

  .put('/:id{[0-9]+}', zValidator('json', masterTreeSchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const book = c.req.valid('json');
    const updated = await db.update(masterTreeSchema).set(book).where(eq(masterTreeSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Tree updated' });
  });
