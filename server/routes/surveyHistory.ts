import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import path from 'path';
import { z } from 'zod';

import { db } from '../db/database.js';
import { surveyHistorySchema, treeSchema, userSchema } from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { validateImage } from '../lib/image.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import { cleanupUploadedImages, deleteImage, uploadFile } from '../lib/upload.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const surveyHistorySchemaZod = z.object({
  id: z.number().int().positive(),
  treeId: z.number().int().positive(),
  userId: z.number().int().positive(),
  surveyDate: z.string().date(),
  surveyTime: z.string().time(),
  category: z.number().int(),
  diameter: z.number(),
  height: z.number(),
  serapanCo2: z.number(),
  treeImage: z.string(),
  leafImage: z.string().optional(),
  skinImage: z.string().optional(),
  fruitImage: z.string().optional(),
  flowerImage: z.string().optional(),
  sapImage: z.string().optional(),
  otherImage: z.string().optional(),
});

const createSurveyHistorySchemaFormData = z.object({
  treeId: z.string().min(1),
  userId: z.string().min(1),
  surveyDate: z.string().date(),
  surveyTime: z.string().time(),
  category: z.string().min(1),
  diameter: z.string().min(1),
  height: z.string().min(1),
  serapanCo2: z.string().min(1),
  treeImage: z.string(),
});

export type SurveyHistory = z.infer<typeof surveyHistorySchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  userId: {
    type: 'one-to-one',
    table: userSchema,
    on: 'id',
  },
  treeId: {
    type: 'one-to-one',
    table: treeSchema,
    on: 'id',
  },
};

// === ROUTES ===
export const surveyHistoryRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: surveyHistorySchema,
      searchBy: 'id',
      relations,
    });
  })

  .post('/', async (c) => {
    const formData = await c.req.parseBody();

    // Validate form data
    const validation = createSurveyHistorySchemaFormData.safeParse(formData);
    if (!validation.success) {
      return c.json({ errors: validation.error.errors }, 400);
    }

    const dir = 'uploads/survey-history';
    const imageFields = [
      'treeImage',
      'leafImage',
      'skinImage',
      'fruitImage',
      'flowerImage',
      'sapImage',
      'otherImage',
    ];

    const imageUploads: Record<string, string | undefined> = {};

    try {
      // Process all image fields

      // Upload all images in parallel
      await Promise.all(
        imageFields.map(async (field) => {
          const file = formData[field] as File | undefined;
          if (file && file.size > 0) {
            try {
              const imagePath = await uploadFile(file, dir);
              imageUploads[field] = `/${dir}/${path.basename(imagePath)}`;
            } catch (err) {
              console.error(`Error uploading ${field}:`, err);
              throw new Error(`Failed to upload ${field}`);
            }
          }
        })
      );

      // Prepare data for database insertion
      const data = {
        ...validation.data,
        ...imageUploads,
        treeId: parseInt(validation.data.treeId),
        userId: parseInt(validation.data.userId),
        category: parseInt(validation.data.category),
        diameter: parseFloat(validation.data.diameter),
        height: parseFloat(validation.data.height),
        serapanCo2: parseFloat(validation.data.serapanCo2),
      };

      // Insert into database
      await db.insert(surveyHistorySchema).values(data);
      return c.json({ message: 'Survey History created' }, 201);
    } catch (err) {
      // Clean up any uploaded images if there was an error
      await cleanupUploadedImages(imageUploads);
      console.error('Error creating survey history:', err);
      return c.json({ error: 'Failed to create survey history' }, 500);
    }
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: surveyHistorySchema, relations });
  })

  .put('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const formData = await c.req.parseBody();
    const treeImage = formData.treeImage as File | undefined;

    console.log('Form Data:', formData);

    const validation = createSurveyHistorySchemaFormData.safeParse(formData);
    const imageErrors = typeof treeImage !== 'string' ? validateImage(treeImage) : [];

    if (!validation.success || imageErrors.length > 0) {
      return c.json({ errors: [...(validation.error?.errors || []), ...imageErrors] }, 400);
    }

    const existing = await db
      .select()
      .from(surveyHistorySchema)
      .where(eq(surveyHistorySchema.id, id))
      .limit(1);

    if (!existing[0]) return c.notFound();

    let newImagePath = existing[0].treeImage;

    if (treeImage instanceof File) {
      const dir = 'uploads/survey-history';
      try {
        const uploadedPath = await uploadFile(treeImage, dir);
        newImagePath = `/${dir}/${path.basename(uploadedPath)}`;
        if (existing[0].treeImage && existing[0].treeImage !== newImagePath)
          deleteImage(existing[0].treeImage);
      } catch {
        return c.json({ error: 'Failed to upload image' }, 500);
      }
    }

    const data = { ...validation.data, image: newImagePath };
    const surveyHistory = {
      ...data,
      treeId: parseInt(data.treeId),
      userId: parseInt(data.userId),
      category: parseInt(data.category),
      diameter: parseFloat(data.diameter),
      height: parseFloat(data.height),
      serapanCo2: parseFloat(data.serapanCo2),
    };
    await db.update(surveyHistorySchema).set(surveyHistory).where(eq(surveyHistorySchema.id, id));
    return c.json({ message: 'Survey History updated' });
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(surveyHistorySchema).where(eq(surveyHistorySchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Survey History deleted' });
  });
