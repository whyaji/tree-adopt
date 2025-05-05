import { inArray } from 'drizzle-orm';
import { Hono } from 'hono';

import { db } from '../db/database.js';
import { surveyHistorySchema, treeSchema } from '../db/schema/schema.js';
import { uploadFile } from '../lib/upload.js';
import authMiddleware from '../middleware/jwt.js';
import type { SurveyHistory } from './surveyHistory.js';
import type { Tree } from './tree.js';

export const massUploadRoute = new Hono()
  .use(authMiddleware)

  .post('/tree', async (c) => {
    const data: {
      trees: Tree[];
      surveys: (Omit<SurveyHistory, 'treeId'> & { code: string })[];
    } = await c.req.json();
    if (data.trees === undefined || data.surveys === undefined) {
      return c.json({ message: 'No data provided' }, 400);
    }
    const trees = data.trees;

    const surveys = data.surveys;
    const dir = '/uploads/survey-history/';

    const resultTrees: {
      id: number;
      status: number;
    }[] = [];

    const resultSurveys: {
      id: number;
      status: number;
    }[] = [];

    // separate list code in survey
    const surveyCodeList = surveys.map((survey) => survey.code);

    try {
      await db.transaction(async (tx) => {
        for (const tree of trees) {
          try {
            const { id, ...rest } = tree;
            const upload = await tx.insert(treeSchema).values(rest);
            if (upload) {
              resultTrees.push({ id, status: 1 });
            } else {
              resultTrees.push({ id, status: 0 });
            }
          } catch (error) {
            console.error('Error inserting tree:', error);
            resultTrees.push({ id: tree.id, status: 0 });
          }
        }
      });
      await db.transaction(async (tx) => {
        const treesForSurveyFromCode = await db
          .select({
            id: treeSchema.id,
            code: treeSchema.code,
          })
          .from(treeSchema)
          .where(inArray(treeSchema.code, surveyCodeList));

        for (const survey of surveys) {
          try {
            const {
              id,
              code,
              treeImage,
              leafImage,
              skinImage,
              fruitImage,
              flowerImage,
              sapImage,
              otherImage,
              ...rest
            } = survey;
            const tree = treesForSurveyFromCode.find((tree) => tree.code === code);
            if (!tree) {
              resultSurveys.push({ id: survey.id, status: 0 });
              continue;
            }
            const upload = await tx.insert(surveyHistorySchema).values({
              treeId: tree.id,
              ...rest,
              treeImage: dir + treeImage,
              leafImage: leafImage ? dir + leafImage : null,
              skinImage: skinImage ? dir + skinImage : null,
              fruitImage: fruitImage ? dir + fruitImage : null,
              flowerImage: flowerImage ? dir + flowerImage : null,
              sapImage: sapImage ? dir + sapImage : null,
              otherImage: otherImage ? dir + otherImage : null,
            });
            if (upload) {
              resultSurveys.push({ id, status: 1 });
            } else {
              resultSurveys.push({ id, status: 0 });
            }
          } catch (error) {
            console.error('Error inserting survey:', error);
            resultSurveys.push({ id: survey.id, status: 0 });
          }
        }
      });
      return c.json({ message: 'Trees created', resultTrees, resultSurveys }, 201);
    } catch (error) {
      console.error('Error creating trees:', error);
      return c.json({ message: 'Error creating trees', resultTrees, resultSurveys }, 500);
    }
  })

  .post('/survey-images', async (c) => {
    const formData = (await c.req.parseBody()) as Record<string, File>;

    const formDataLength = Object.keys(formData).length;

    if (formDataLength === 0) {
      return c.json({ message: 'No files provided' }, 400);
    }
    const dir = 'uploads/survey-history';

    const responses: { fileIndex: number; status: number; message: string }[] = [];

    for (let i = 0; i < formDataLength; i++) {
      const file = formData[`file[${i}]`] as File;

      try {
        await uploadFile(file, dir);
        responses.push({ fileIndex: i, status: 1, message: 'File uploaded successfully' });
      } catch (err) {
        console.error(`Error uploading file at index ${i}:`, err);
        responses.push({ fileIndex: i, status: 0, message: 'Error uploading file' });
      }
    }

    const notAllFilesUploaded = responses.some((response) => response.status === 0);
    if (notAllFilesUploaded) {
      return c.json({ message: 'Some files failed to upload', responses }, 500);
    }

    return c.json({ message: 'All files uploaded successfully', responses }, 201);
  });
