import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import path from 'path';
import { z } from 'zod';

import { db } from '../../db/database.js';
import {
  boundaryMarkerSchema,
  checkBoundaryMarkerHistorySchema,
  kelompokKomunitasSchema,
  userSchema,
} from '../../db/schema/schema.js';
import { getDataBy } from '../../lib/dataBy.js';
import { getPaginationData } from '../../lib/pagination.js';
import type { RelationsType } from '../../lib/relation.js';
import { cleanupUploadedImagesByArray, uploadFile } from '../../lib/upload.js';
import authMiddleware from '../../middleware/jwt.js';

// === ZOD SCHEMAS ===
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkBoundaryMarkerHistorySchemaZod = z.object({
  id: z.number().int().positive(),
  kelompokKomunitasId: z.number().int().positive(),
  boundaryMarkerId: z.number().int().positive(),
  boundaryMarkerCode: z.string().optional(),
  checkerId: z.number().int().positive(),
  conditions: z.record(z.any()),
  actions: z.record(z.any()),
  images: z.array(z.string()).nonempty(),
  checkDate: z.string(),
  checkTime: z.string(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().optional(),
});

const createCheckBoundaryMarkerHistorySchemaFormData = z.object({
  kelompokKomunitasId: z.string().min(1),
  boundaryMarkerId: z.string().min(1),
  boundaryMarkerCode: z.string().optional(),
  checkerId: z.string().min(1),
  conditions: z.string().min(1), // will be parsed as JSON
  actions: z.string().min(1), // will be parsed as JSON
  checkDate: z.string().min(1),
  checkTime: z.string().regex(/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/),
});

type ImagesType = {
  images: string[];
};

export type CheckBoundaryMarkerHistory = z.infer<typeof checkBoundaryMarkerHistorySchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  checkerId: {
    type: 'one-to-one',
    table: userSchema,
    on: 'id',
  },
  boundaryMarkerId: {
    type: 'one-to-one',
    table: boundaryMarkerSchema,
    on: 'id',
  },
  kelompokKomunitasId: {
    type: 'one-to-one',
    table: kelompokKomunitasSchema, // Assuming this is defined elsewhere
    on: 'id',
  },
};

// === ROUTES ===
export const boundaryMarkerCheckHistoryRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: checkBoundaryMarkerHistorySchema,
      searchBy: 'id',
      relations,
    });
  })

  .post('/', async (c) => {
    const formData = await c.req.parseBody();

    // Validate form data (except images)
    const validation = createCheckBoundaryMarkerHistorySchemaFormData.safeParse(formData);
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

    const dir = 'uploads/check-boundary-marker-history';

    const imageUploads: ImagesType = { images: [] };

    try {
      // Collect all keys like 'images[0]', 'images[1]', etc.
      let idx = 0;
      while (true) {
        const key = `images[${idx}]`;
        if (!(key in formData)) break;
        const value = formData[key];
        if (value instanceof File && value.size > 0) {
          try {
            const imagePath = await uploadFile(value, dir, {
              withTimeMilis: true,
              withThumbnail: true,
            });
            imageUploads.images.push(`/${dir}/${path.basename(imagePath)}`);
          } catch (err) {
            console.error(`Error uploading image:`, err);
            throw new Error(`Failed to upload image`);
          }
        } else if (typeof value === 'string' && value.trim() !== '') {
          imageUploads.images.push(value);
        }
        idx++;
      }

      if (imageUploads.images.length === 0) {
        return c.json({ error: `Missing required images` }, 400);
      }

      // Prepare data for DB
      const data = {
        kelompokKomunitasId: parseInt(validation.data.kelompokKomunitasId),
        boundaryMarkerId: parseInt(validation.data.boundaryMarkerId),
        boundaryMarkerCode: validation.data.boundaryMarkerCode,
        checkerId: parseInt(validation.data.checkerId),
        conditions: JSON.parse(validation.data.conditions),
        actions: JSON.parse(validation.data.actions),
        images: imageUploads.images,
        checkDate: validation.data.checkDate,
        checkTime: validation.data.checkTime,
      };

      await db.insert(checkBoundaryMarkerHistorySchema).values(data);
      return c.json({ message: 'Check Boundary Marker History created' }, 201);
    } catch (err) {
      await cleanupUploadedImagesByArray(imageUploads.images);
      console.error('Error creating check boundary marker history:', err);
      return c.json({ error: 'Failed to create check boundary marker history' }, 500);
    }
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: checkBoundaryMarkerHistorySchema, relations });
  })

  .put('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const formData = await c.req.parseBody();

    // Validate form data (except images)
    const validation = createCheckBoundaryMarkerHistorySchemaFormData.safeParse(formData);
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
      .from(checkBoundaryMarkerHistorySchema)
      .where(eq(checkBoundaryMarkerHistorySchema.id, id))
      .limit(1);

    if (!existing[0]) return c.notFound();

    const dir = 'uploads/check-boundary-marker-history';

    const imageUploads: ImagesType = { images: [] };

    try {
      let idx = 0;
      while (true) {
        const key = `images[${idx}]`;
        if (!(key in formData)) break;
        const value = formData[key];
        if (value instanceof File && value.size > 0) {
          try {
            const imagePath = await uploadFile(value, dir, { withTimeMilis: true });
            imageUploads.images.push(`/${dir}/${path.basename(imagePath)}`);
          } catch (err) {
            console.error(`Error uploading image:`, err);
            throw new Error(`Failed to upload image`);
          }
        } else if (typeof value === 'string' && value.trim() !== '') {
          imageUploads.images.push(value);
        }
        idx++;
      }

      if (imageUploads.images.length === 0) {
        return c.json({ error: `Missing required images` }, 400);
      }

      // Prepare data for DB
      const data = {
        kelompokKomunitasId: parseInt(validation.data.kelompokKomunitasId),
        boundaryMarkerId: parseInt(validation.data.boundaryMarkerId),
        boundaryMarkerCode: validation.data.boundaryMarkerCode,
        checkerId: parseInt(validation.data.checkerId),
        conditions: JSON.parse(validation.data.conditions),
        actions: JSON.parse(validation.data.actions),
        images: imageUploads.images,
        checkDate: validation.data.checkDate,
        checkTime: validation.data.checkTime,
      };

      await db
        .update(checkBoundaryMarkerHistorySchema)
        .set(data)
        .where(eq(checkBoundaryMarkerHistorySchema.id, id));
      return c.json({ message: 'Check Boundary Marker History updated' });
    } catch (err) {
      await cleanupUploadedImagesByArray(imageUploads.images);
      console.error('Error updating check boundary marker history:', err);
      return c.json({ error: 'Failed to update check boundary marker history' }, 500);
    }
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db
      .delete(checkBoundaryMarkerHistorySchema)
      .where(eq(checkBoundaryMarkerHistorySchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Check Boundary Marker History deleted' });
  });
