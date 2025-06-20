import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { groupActivitySchema, kelompokKomunitasSchema } from '../db/schema/schema.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import { cleanupUploadedImages, uploadFile } from '../lib/upload.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const groupActivitySchemaZod = z.object({
  id: z.number().int().positive(),
  kelompokKomunitasId: z.number().int().positive(),
  code: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  description: z.string().optional(),
  image: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  createdBy: z.number().int().positive(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

const creategroupActivitySchema = z.object({
  kelompokKomunitasId: z.string().min(1),
  code: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  description: z.string().optional(),
  latitude: z.string().min(1),
  longitude: z.string().min(1),
  createdBy: z.string().min(1),
});

export type GroupActivity = z.infer<typeof groupActivitySchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  kelompokKomunitasId: {
    type: 'one-to-one',
    table: kelompokKomunitasSchema,
    on: 'id',
  },
};

// === ROUTES ===
export const groupActivityRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: groupActivitySchema,
      searchBy: 'title',
      relations,
    });
  })

  .get('/images', async (c) => {
    return await getPaginationData({
      c,
      table: groupActivitySchema,
      searchBy: 'title',
      relations,
      selectObject: {
        id: groupActivitySchema.id,
        image: groupActivitySchema.image,
      },
    });
  })

  .get('/:id{[0-9]+}', async (c) => {
    const id = c.req.param('id');
    const data = await db
      .select()
      .from(groupActivitySchema)
      .where(eq(groupActivitySchema.id, Number(id)));

    if (data.length === 0) return c.notFound();

    return c.json({ data: data[0] });
  })

  // form data with image upload
  .post('/', async (c) => {
    const formData = await c.req.parseBody();

    const validation = creategroupActivitySchema.safeParse(formData);
    if (!validation.success) {
      return c.json(
        {
          error: {
            issues: validation.error.errors,
          },
        },
        400
      );
    }

    let image;
    try {
      if (formData.image instanceof File) {
        const imagePath = await uploadFile(formData.image, 'uploads/group-activity/', {
          withTimeMilis: true,
          withThumbnail: true,
        });
        image = imagePath;
      } else {
        return c.json({ error: 'Image is required' }, 400);
      }
    } catch (error) {
      if (image) {
        await cleanupUploadedImages({ image });
      }
      return c.json({ error: 'Failed to upload image' + error }, 500);
    }

    const groupActivityData = {
      ...validation.data,
      image,
      kelompokKomunitasId: Number(validation.data.kelompokKomunitasId),
      latitude: Number(validation.data.latitude),
      longitude: Number(validation.data.longitude),
      createdBy: Number(validation.data.createdBy),
    };

    try {
      await db.insert(groupActivitySchema).values(groupActivityData);
    } catch (error) {
      if (image) {
        await cleanupUploadedImages({ image });
      }
      return c.json({ error: 'Failed to create group activity' + error }, 500);
    }

    return c.json({ message: 'Group activity created' }, 201);
  })

  .put('/:id{[0-9]+}', async (c) => {
    const id = c.req.param('id');
    const formData = await c.req.parseBody();

    const validation = creategroupActivitySchema.safeParse(formData);
    if (!validation.success) {
      return c.json(
        {
          error: {
            issues: validation.error.errors,
          },
        },
        400
      );
    }

    const existing = await db
      .select()
      .from(groupActivitySchema)
      .where(eq(groupActivitySchema.id, Number(id)))
      .limit(1);

    if (existing.length === 0) return c.notFound();

    const existingImage = existing[0].image;
    let image = existingImage;

    if (formData.image instanceof File) {
      try {
        const uploadedPath = await uploadFile(formData.image, 'uploads/group-activity/', {
          withTimeMilis: true,
          withThumbnail: true,
        });
        image = uploadedPath;
      } catch (error) {
        return c.json({ error: 'Failed to upload image' + error }, 500);
      }
    }

    const groupActivityData = {
      ...validation.data,
      image,
      kelompokKomunitasId: Number(validation.data.kelompokKomunitasId),
      latitude: Number(validation.data.latitude),
      longitude: Number(validation.data.longitude),
      createdBy: Number(validation.data.createdBy),
    };

    try {
      await db
        .update(groupActivitySchema)
        .set(groupActivityData)
        .where(eq(groupActivitySchema.id, Number(id)));

      if (image && existingImage && image !== existingImage) {
        await cleanupUploadedImages({ existingImage });
      }
    } catch (error) {
      if (image && image !== existingImage) {
        await cleanupUploadedImages({ image });
      }
      return c.json({ error: 'Failed to update group activity' + error }, 500);
    }

    return c.json({ message: 'Group activity updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = c.req.param('id');
    const existing = await db
      .select()
      .from(groupActivitySchema)
      .where(eq(groupActivitySchema.id, Number(id)))
      .limit(1);

    if (existing.length === 0) return c.notFound();

    try {
      await db.delete(groupActivitySchema).where(eq(groupActivitySchema.id, Number(id)));
      if (existing[0].image) {
        await cleanupUploadedImages({ image: existing[0].image });
      }
    } catch (error) {
      return c.json({ error: 'Failed to delete group activity' + error }, 500);
    }

    return c.json({ message: 'Group activity deleted' });
  });
