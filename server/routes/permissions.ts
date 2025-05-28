import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { permissionsSchema, roleHasPermissionsSchema } from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const permissionSchemaZod = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  code: z.string().min(1),
  groupCode: z.string().min(1),
  groupName: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().optional(),
});

const createPermissionSchema = permissionSchemaZod.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
export type Permission = z.infer<typeof permissionSchemaZod>;

// === ROUTES ===
export const permissionsRoute = new Hono()
  .use(authMiddleware)
  .get('/', async (c) => {
    return await getPaginationData({ c, table: permissionsSchema, searchBy: 'name,code' });
  })

  .post('/', zValidator('json', createPermissionSchema), async (c) => {
    const permission = c.req.valid('json');
    await db.insert(permissionsSchema).values(permission);
    return c.json({ message: 'Permission created' }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: permissionsSchema });
  })

  .put('/:id{[0-9]+}', zValidator('json', createPermissionSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const permission = c.req.valid('json');
    const updated = await db
      .update(permissionsSchema)
      .set(permission)
      .where(eq(permissionsSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Permission updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(permissionsSchema).where(eq(permissionsSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }

    // Also delete associated role permissions
    await db.delete(roleHasPermissionsSchema).where(eq(roleHasPermissionsSchema.permissionId, id));

    return c.json({ message: 'Permission deleted' });
  });
