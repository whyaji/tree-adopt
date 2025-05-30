import { zValidator } from '@hono/zod-validator';
import { and, eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import {
  permissionsSchema,
  roleHasPermissionsSchema,
  rolesSchema,
  userHasRolesSchema,
} from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const roleSchemaZod = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().optional(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rolePermissionsZod = z.object({
  id: z.number().int().positive(),
  roleId: z.number().int().positive(),
  permissionId: z.number().int().positive(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().optional(),
});

const createRoleSchema = roleSchemaZod.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

export type Role = z.infer<typeof roleSchemaZod>;
export type RolePermissions = z.infer<typeof rolePermissionsZod>;

// === RELATIONS ===
const relations: RelationsType = {
  permissions: {
    type: 'many-to-many',
    table: roleHasPermissionsSchema,
    on: 'roleId',
    child: {
      'permissions.permissionId': {
        type: 'one-to-one',
        table: permissionsSchema,
        on: 'id',
        from: 'permissionId',
        alias: 'permission',
      },
    },
  },
};

// === ROUTES ===
export const rolesRoute = new Hono()
  .use(authMiddleware)
  .get('/', async (c) => {
    return await getPaginationData({ c, table: rolesSchema, searchBy: 'name,code', relations });
  })

  .post('/', zValidator('json', createRoleSchema), async (c) => {
    const role = c.req.valid('json');
    await db.insert(rolesSchema).values(role);
    return c.json({ message: 'Role created' }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: rolesSchema });
  })

  .put('/:id{[0-9]+}', zValidator('json', createRoleSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const role = c.req.valid('json');
    const updated = await db.update(rolesSchema).set(role).where(eq(rolesSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Role updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(rolesSchema).where(eq(rolesSchema.id, id));

    if (!deleted) {
      return c.notFound();
    }

    // Also delete associated permissions
    await db.delete(roleHasPermissionsSchema).where(eq(roleHasPermissionsSchema.roleId, id));

    // Also delete associated user roles
    await db.delete(userHasRolesSchema).where(eq(userHasRolesSchema.roleId, id));

    return c.json({ message: 'Role deleted' });
  })

  // ROLE PERMISSIONS ENDPOINTS
  .post(
    '/:id{[0-9]+}/save-permissions',
    zValidator('json', z.object({ permissionIds: z.array(z.number().int().positive()) })),
    async (c) => {
      const id = parseInt(c.req.param('id'));
      const { permissionIds } = c.req.valid('json');

      // Check if role exists and get its permissions
      const role = await db.query.rolesSchema.findFirst({
        where: (roles, { eq }) => eq(roles.id, id),
      });
      if (!role) {
        return c.notFound();
      }

      // Get current permissions for the role
      const currentRolePermissions = await db
        .select()
        .from(roleHasPermissionsSchema)
        .where(eq(roleHasPermissionsSchema.roleId, id));

      const currentPermissionIds = currentRolePermissions.map((rp) => rp.permissionId);

      // Exclude permissionIds that are already assigned (avoid duplicates)
      const newPermissionIds = permissionIds.filter((pid) => !currentPermissionIds.includes(pid));

      // Find permissions to remove (those currently assigned but not in the new list)
      const permissionIdsToRemove = currentPermissionIds.filter(
        (pid) => !permissionIds.includes(pid)
      );

      // Insert new permissions
      if (newPermissionIds.length > 0) {
        await db.insert(roleHasPermissionsSchema).values(
          newPermissionIds.map((pid) => ({
            roleId: id,
            permissionId: pid,
          }))
        );
      }

      // Delete old permissions that are not in the new list
      if (permissionIdsToRemove.length > 0) {
        await db
          .delete(roleHasPermissionsSchema)
          .where(
            and(
              eq(roleHasPermissionsSchema.roleId, id),
              inArray(roleHasPermissionsSchema.permissionId, permissionIdsToRemove)
            )
          );
      }

      return c.json({ message: 'Permissions saved to role' }, 201);
    }
  );
