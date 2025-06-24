import { zValidator } from '@hono/zod-validator';
import { count, eq, type InferSelectModel } from 'drizzle-orm';
import { Hono } from 'hono';
import path from 'path';
import { z } from 'zod';

import { db } from '../db/database.js';
import {
  groupActivitySchema,
  groupCoordinateAreaSchema,
  kelompokKomunitasSchema,
  treeSchema,
} from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { validateImage } from '../lib/image.js';
import { getPaginationData } from '../lib/pagination.js';
import { type RelationsType } from '../lib/relation.js';
import { deleteImage, uploadFile } from '../lib/upload.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const kelompokKomunitasSchemaZod = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  description: z.string().min(1),
  noSk: z.string().min(1),
  kups: z.string().min(1),
  programUnggulan: z.string().min(1),
  address: z.string().min(1),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
  image: z.string().min(1),
});

const groupCoordinateAreaSchemaZod = z.object({
  id: z.number().int().positive(),
  kelompokKomunitasId: z.number().int().positive(),
  coordinates: z.array(z.tuple([z.number(), z.number()])),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  deletedAt: z.string().datetime().nullable().optional(),
});

const createPostSchema = kelompokKomunitasSchemaZod.omit({ id: true, image: true });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createGroupCoordinateAreaSchema = groupCoordinateAreaSchemaZod.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});
const updateGroupCoordinateAreaSchema = z.array(
  z.object({
    id: z.number().int().positive().optional(),
    coordinates: z.array(z.tuple([z.number(), z.number()])),
    status: z.enum(['create', 'update', 'delete']),
  })
);

export type KelompokKomunitas = InferSelectModel<typeof kelompokKomunitasSchema>;
export type GroupCoordinateArea = Omit<
  InferSelectModel<typeof groupCoordinateAreaSchema>,
  'coordinates'
> & {
  coordinates: [number, number][];
};

// === RELATIONS ===
const relations: RelationsType = {
  trees: {
    type: 'one-to-many',
    table: treeSchema,
    on: 'kelompokKomunitasId',
  },
  groupActivities: {
    type: 'one-to-many',
    table: groupActivitySchema,
    on: 'kelompokKomunitasId',
  },
  groupCoordinateArea: {
    type: 'one-to-many',
    table: groupCoordinateAreaSchema,
    on: 'kelompokKomunitasId',
  },
};

// === ROUTES ===
export const kelompokKomunitasRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: kelompokKomunitasSchema,
      searchBy: 'name',
      relations,
    });
  })

  .get('/by-name/:name', async (c) => {
    const name = c.req.param('name');
    const data = await db
      .select({
        id: kelompokKomunitasSchema.id,
      })
      .from(kelompokKomunitasSchema)
      .where(eq(kelompokKomunitasSchema.name, name));

    if (data.length === 0) return c.notFound();

    return await getDataBy({ id: data[0].id, c, table: kelompokKomunitasSchema, relations });
  })

  .get('/total', async (c) => {
    const total = await db.select({ count: count() }).from(kelompokKomunitasSchema);
    return c.json({ total: total[0].count });
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: kelompokKomunitasSchema, relations });
  })

  .post('/', async (c) => {
    const formData = await c.req.parseBody();
    const image = formData.image as File | undefined;

    const validation = createPostSchema.safeParse(formData);
    const imageErrors = validateImage(image);

    if (!validation.success || imageErrors.length > 0) {
      return c.json(
        {
          error: {
            issues: [...(validation.error?.errors || []), ...imageErrors],
          },
        },
        400
      );
    }

    const dir = 'uploads/kelompok-komunitas';
    try {
      const imagePath = await uploadFile(image!, dir, { withTimeMilis: true, withThumbnail: true });
      const data = {
        ...validation.data,
        image: `/${dir}/${path.basename(imagePath)}`,
        latitude: parseFloat(validation.data.latitude),
        longitude: parseFloat(validation.data.longitude),
      };
      const res = await db.insert(kelompokKomunitasSchema).values(data);
      return c.json(
        { message: 'Kelompok Komunitas created', kelompokKomunitasId: res[0].insertId },
        201
      );
    } catch (err) {
      console.error('Error uploading image:', err);
      return c.json({ error: 'Failed to upload image' }, 500);
    }
  })

  .put('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const formData = await c.req.parseBody();
    const image = formData.image as File | string | undefined;

    const validation = createPostSchema.safeParse(formData);
    const imageErrors = typeof image !== 'string' ? validateImage(image) : [];

    if (!validation.success || imageErrors.length > 0) {
      return c.json(
        {
          error: {
            issues: [...(validation.error?.errors || []), ...imageErrors],
          },
        },
        400
      );
    }

    const existing = await db
      .select()
      .from(kelompokKomunitasSchema)
      .where(eq(kelompokKomunitasSchema.id, id))
      .limit(1);

    if (!existing[0]) return c.notFound();

    try {
      let newImagePath = existing[0].image;

      if (image instanceof File) {
        const dir = 'uploads/kelompok-komunitas';
        try {
          const uploadedPath = await uploadFile(image, dir, {
            withTimeMilis: true,
            withThumbnail: true,
          });
          newImagePath = `/${dir}/${path.basename(uploadedPath)}`;
          if (existing[0].image && existing[0].image !== newImagePath)
            deleteImage(existing[0].image);
        } catch {
          return c.json({ error: 'Failed to upload image' }, 500);
        }
      }

      const data = {
        ...validation.data,
        image: newImagePath,
        latitude: parseFloat(validation.data.latitude),
        longitude: parseFloat(validation.data.longitude),
      };
      await db.update(kelompokKomunitasSchema).set(data).where(eq(kelompokKomunitasSchema.id, id));
      return c.json({ message: 'Kelompok Komunitas updated' });
    } catch (err) {
      console.error('Error updating Kelompok Komunitas:', err);
      return c.json({ error: 'Failed to update Kelompok Komunitas' }, 500);
    }
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const existing = await db
      .select()
      .from(kelompokKomunitasSchema)
      .where(eq(kelompokKomunitasSchema.id, id))
      .limit(1);

    if (!existing[0]) return c.notFound();

    if (existing[0].image) deleteImage(existing[0].image);

    await db.delete(kelompokKomunitasSchema).where(eq(kelompokKomunitasSchema.id, id));
    return c.json({ message: 'Kelompok Komunitas deleted' });
  })

  .post(
    '/:id{[0-9]+}/update-group-coordinate-area',
    zValidator('json', updateGroupCoordinateAreaSchema),
    async (c) => {
      const id = parseInt(c.req.param('id'));

      // body is an array of local trees with status 1: create, 2: update, 3: delete
      const groupCoordinatesAreas = c.req.valid('json');

      // process each local tree based on status
      for (const groupCoordinateArea of groupCoordinatesAreas) {
        if (groupCoordinateArea.status === 'create') {
          // create
          await db.insert(groupCoordinateAreaSchema).values({
            coordinates: groupCoordinateArea.coordinates,
            kelompokKomunitasId: id,
          });
        } else if (groupCoordinateArea.status === 'update' && groupCoordinateArea.id) {
          // update
          await db
            .update(groupCoordinateAreaSchema)
            .set({ coordinates: groupCoordinateArea.coordinates })
            .where(eq(groupCoordinateAreaSchema.id, groupCoordinateArea.id));
        } else if (groupCoordinateArea.status === 'delete' && groupCoordinateArea.id) {
          // delete
          await db
            .delete(groupCoordinateAreaSchema)
            .where(eq(groupCoordinateAreaSchema.id, groupCoordinateArea.id));
        }
      }
      return c.json({ message: 'Group coordinate updated successfully' });
    }
  );
