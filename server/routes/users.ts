import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { kelompokKomunitasSchema, userSchema } from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const userSchemaZod = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  avatar: z.string().url().optional(),
  role: z.number().int().default(1), // 0 = admin, 1 = user
  groupId: z.number().int().positive().optional(),
  reset_token: z.string().min(1).optional(),
});

const createUserSchema = userSchemaZod.omit({
  id: true,
  groupId: true,
  reset_token: true,
  role: true,
  avatar: true,
});

const updateSchemaZod = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().optional(),
  avatar: z.string().url().optional(),
  role: z.number().int().default(1), // 0 = admin, 1 = user
  groupId: z.number().int().positive().optional(),
});

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
  })

  .post('/', zValidator('json', createUserSchema), async (c) => {
    const user = c.req.valid('json');
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const created = await db.insert(userSchema).values({ ...user, password: hashedPassword });
    if (!created) {
      return c.json({ message: 'Failed to create user' }, 500);
    }
    return c.json({ message: 'User created', data: created });
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: userSchema, relations });
  })

  .put('/:id{[0-9]+}', zValidator('json', updateSchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const user = c.req.valid('json');
    const hashedPassword = user.password ? await bcrypt.hash(user.password, 10) : undefined;
    const updateData = {
      ...user,
      password: hashedPassword,
    };
    if (!updateData.password) {
      delete updateData.password;
    }
    const updated = await db.update(userSchema).set(updateData).where(eq(userSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'User updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(userSchema).where(eq(userSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'User deleted' });
  });
