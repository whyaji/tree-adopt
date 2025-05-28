import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { and, eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { kelompokKomunitasSchema, userHasRolesSchema, userSchema } from '../db/schema/schema.js';
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
  })

  // SAVE ROLES
  .post(
    '/:id{[0-9]+}/save-roles',
    zValidator('json', z.object({ roleIds: z.array(z.number().int().positive()) })),
    async (c) => {
      const id = parseInt(c.req.param('id'));
      const { roleIds } = c.req.valid('json');

      // Check if user exists
      const user = await db.query.userSchema.findFirst({
        where: (users, { eq }) => eq(users.id, id),
      });
      if (!user) {
        return c.notFound();
      }

      // get users roles list
      const existingRoles = await db.query.userHasRolesSchema.findMany({
        where: (userHasRoles, { eq }) => eq(userHasRoles.userId, id),
      });

      // Exclude existing roles
      const newRoleIds = roleIds.filter(
        (roleId) => !existingRoles.some((ur) => ur.roleId === roleId)
      );

      // Remove roles that are not in the new list
      const rolesToRemove = existingRoles
        .filter((ur) => !roleIds.includes(ur.roleId))
        .map((ur) => ur.id);

      // insert new roles
      if (newRoleIds.length > 0) {
        await db.insert(userHasRolesSchema).values(
          newRoleIds.map((roleId) => ({
            userId: id,
            roleId,
          }))
        );
      }

      // remove roles that are not in the new list
      if (rolesToRemove.length > 0) {
        await db
          .delete(userHasRolesSchema)
          .where(
            and(eq(userHasRolesSchema.userId, id), inArray(userHasRolesSchema.id, rolesToRemove))
          );
      }

      return c.json({ message: 'User roles saved' }, 201);
    }
  );
