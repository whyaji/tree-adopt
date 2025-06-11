import { zValidator } from '@hono/zod-validator';
import bcrypt from 'bcryptjs';
import { eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { deleteCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';
import { z } from 'zod';

import { ROLE } from '../../frontend/src/enum/role.enum.js';
import { db } from '../db/database.js';
import {
  kelompokKomunitasSchema,
  permissionsSchema,
  roleHasPermissionsSchema,
  rolesSchema,
  userHasRolesSchema,
  userSchema,
} from '../db/schema/schema.js';
import env from '../lib/env.js';
import { logger } from '../lib/logger.js';
import { reformatMainKey } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';
import type { Permission } from './permissions.js';
import type { Role } from './roles.js';

// JWT secret key
const JWT_SECRET = env.JWT_SECRET;

const userSchemaZod = z.object({
  id: z.number().int().positive(),
  avatar: z.string().optional(),
  role: z.number().int().positive(),
  groupId: z.number().int().optional(),
  name: z.string().min(3),
  email: z.string().email().min(3),
  password: z.string().min(6),
});

const loginSchema = userSchemaZod.omit({ name: true, id: true, role: true, groupId: true });
const registerSchema = userSchemaZod.omit({ id: true, role: true, groupId: true });

export type User = z.infer<typeof userSchemaZod>;

export const authRoute = new Hono()
  .post('/login', zValidator('json', loginSchema), async (c) => {
    const { email, password } = await c.req.valid('json');

    try {
      // Find user by email
      const user = await db.select().from(userSchema).where(eq(userSchema.email, email));

      if (user.length === 0) {
        return c.json({ message: 'Invalid email or password.' }, 401);
      }

      // Verify password
      const hashedPassword = await bcrypt.hash(password, env.HASH_SALT ?? 'salt');
      console.log('Hashed Password:', hashedPassword);
      console.log('Stored Password:', user[0].password);
      if (hashedPassword !== user[0].password) {
        return c.json({ message: 'Invalid email or password.' }, 401);
      }

      // Calculate token expiration (e.g., 24 hours from now)
      const tokenExpiredAt = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 24 hours in seconds

      // Generate JWT with expiration
      const token = await sign(
        {
          userId: user[0].id,
          email: user[0].email,
          groupId: user[0].groupId,
          exp: tokenExpiredAt, // Add expiration to JWT payload
        },
        JWT_SECRET
      );

      let userData = await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.id, user[0].id))
        .limit(1)
        .leftJoin(
          kelompokKomunitasSchema,
          eq(userSchema['groupId'], kelompokKomunitasSchema['id'])
        );

      userData = reformatMainKey(userData, ['groupId']);

      // Format tokenExpiredAt as 'YYYY-MM-DD HH:mm:ss'
      const tokenExpiredAtFormatted = new Date(tokenExpiredAt * 1000).toISOString();

      return c.json({
        data: {
          token,
          tokenExpiredAt: tokenExpiredAtFormatted,
          user: userData[0],
        },
      });
    } catch (error) {
      logger.error('Error during sign-in:', error);
      return c.json({ message: 'Internal server error.' }, 500);
    }
  })
  .post('/register', zValidator('json', registerSchema), async (c) => {
    const { email, name, password } = await c.req.json();

    try {
      // Check if user already exists
      const existingUser = await db.select().from(userSchema).where(eq(userSchema.email, email));

      if (existingUser.length > 0) {
        return c.json({ message: 'User already exists.' }, 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, env.HASH_SALT ?? 'salt');

      // Insert new user
      await db.insert(userSchema).values({
        name,
        email,
        password: hashedPassword,
      });

      return c.json({ message: 'User created successfully.' }, 201);
    } catch (error) {
      logger.error('Error during sign-up:', error);
      return c.json({ message: 'Internal server error.' }, 500);
    }
  })
  .get('/profile', authMiddleware, async (c) => {
    const payload = c.get('jwtPayload');
    try {
      const user = await getUserByIdWithRoles(payload.userId);
      return c.json({ data: user });
    } catch (error) {
      logger.error('Error fetching profile:', error);
      return c.json({ message: 'Internal server error.' }, 500);
    }
  })
  .post('/logout', authMiddleware, async (c) => {
    deleteCookie(c, 'auth_token');
    return c.json({ message: 'Logout successful.' });
  });

export async function getUserByIdWithRoles(userId: number) {
  const userQueryResult = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.id, userId))
    .leftJoin(kelompokKomunitasSchema, eq(userSchema.groupId, kelompokKomunitasSchema.id));

  if (userQueryResult.length === 0) {
    throw new Error('User not found');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = {
    ...userQueryResult[0].users,
    kelompokKomunitas: userQueryResult[0].kelompok_komunitas,
    roles: [],
    permissions: [],
  };

  if (user.role === ROLE.USER) {
    return user;
  }

  // remove password from user object
  user = { ...user, password: undefined };

  const roles = await db
    .select()
    .from(userHasRolesSchema)
    .where(eq(userHasRolesSchema.userId, user.id))
    .leftJoin(rolesSchema, eq(userHasRolesSchema.roleId, rolesSchema.id));

  if (roles.length > 0) {
    user = {
      ...user,
      roles: roles.map((role) => role.roles),
    };
    const roleIds: number[] = user.roles.map((role: Role) => role.id);

    const permissions = await db
      .select()
      .from(roleHasPermissionsSchema)
      .where(inArray(roleHasPermissionsSchema.roleId, roleIds))
      .leftJoin(permissionsSchema, eq(roleHasPermissionsSchema.permissionId, permissionsSchema.id));

    if (permissions.length > 0) {
      user.roles = user.roles.map((role: Role) => ({
        ...role,
        permissions: permissions
          .map((perm) => (role.id === perm.role_has_permissions.roleId ? perm.permissions : null))
          .filter((perm) => perm !== null),
      }));
    }
  }

  const responseRoles = user.roles.map((role: Role) => ({
    name: role.name,
    code: role.code,
  }));

  const responsePermissions: string[] = user.roles.flatMap(
    (role: Role & { permissions: Permission[] }) =>
      role.permissions.map((perm) => perm.groupCode + '.' + perm.code) || []
  );

  const uniquePermissions = Array.from(new Set(responsePermissions));

  user = {
    ...user,
    roles: responseRoles,
    permissions: uniquePermissions,
  };

  return user;
}
