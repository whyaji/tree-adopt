import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import path from 'path';
import { z } from 'zod';

import { db } from '../db/database.js';
import { surveyHistorySchema, userSchema } from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { validateImage } from '../lib/image.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import { deleteImage, uploadFile } from '../lib/upload.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const surveyHistorySchemaZod = z.object({
  id: z.number().int().positive(),
  treeId: z.number().int().positive(),
  userId: z.number().int().positive(),
  surveyDate: z.string().datetime(),
  category: z.number().int(),
  diameter: z.number(),
  height: z.number(),
  serapanCo2: z.number(),
  image: z.string(),
});

const createSurveyHistorySchemaFormData = z.object({
  treeId: z.string().min(1),
  userId: z.string().min(1),
  surveyDate: z.string().datetime(),
  category: z.string().min(1),
  diameter: z.string().min(1),
  height: z.string().min(1),
  serapanCo2: z.string().min(1),
});

export type SurveyHistory = z.infer<typeof surveyHistorySchemaZod>;

// === RELATIONS ===
const relations: RelationsType = {
  userId: {
    type: 'one-to-one',
    table: userSchema,
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

  // .post('/', zValidator('json', createSurveyHistorySchema), async (c) => {
  //   const surveyHistory = c.req.valid('json');
  //   await db.insert(surveyHistorySchema).values(surveyHistory);
  //   return c.json({ message: 'Survey History created' }, 201);
  // })

  .post('/', async (c) => {
    const formData = await c.req.parseBody();
    const image = formData.image as File | undefined;

    const validation = createSurveyHistorySchemaFormData.safeParse(formData);
    const imageErrors = validateImage(image);

    if (!validation.success || imageErrors.length > 0) {
      return c.json({ errors: [...(validation.error?.errors || []), ...imageErrors] }, 400);
    }

    const dir = 'uploads/survey-history';
    try {
      const imagePath = await uploadFile(image!, dir);
      const data = {
        ...validation.data,
        image: `/${dir}/${path.basename(imagePath)}`,
      };
      try {
        const surveyHistory = {
          ...data,
          treeId: parseInt(data.treeId),
          userId: parseInt(data.userId),
          category: parseInt(data.category),
          diameter: parseFloat(data.diameter),
          height: parseFloat(data.height),
          serapanCo2: parseFloat(data.serapanCo2),
        };
        await db.insert(surveyHistorySchema).values(surveyHistory);
        return c.json({ message: 'Survey History created' }, 201);
      } catch (err) {
        try {
          await deleteImage(imagePath);
        } catch (deleteErr) {
          console.error('Error deleting image:', deleteErr);
        }
        console.error('Error inserting survey history:', err);
        return c.json({ error: 'Failed to insert survey history' }, 500);
      }
    } catch (err) {
      console.error('Error uploading image:', err);
      return c.json({ error: 'Failed to upload image' }, 500);
    }
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: surveyHistorySchema, relations });
  })

  .put('/:id{[0-9]+}', zValidator('json', surveyHistorySchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const surveyHistory = c.req.valid('json');
    const updated = await db
      .update(surveyHistorySchema)
      .set(surveyHistory)
      .where(eq(surveyHistorySchema.id, id));
    if (!updated) {
      return c.notFound();
    }
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
