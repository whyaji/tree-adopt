import { eq } from 'drizzle-orm';
import { Hono } from 'hono';

import { db } from '../db/database.js';
import { surveyHistorySchema, treeCodeSchema, treeSchema } from '../db/schema/schema.js';
import { uploadFile } from '../lib/upload.js';
import authMiddleware from '../middleware/jwt.js';
import type { SurveyHistory } from './surveyHistory.js';
import type { Tree } from './tree.js';
import type { TreeCode } from './treeCode.js';

export const massUploadRoute = new Hono()
  .use(authMiddleware)

  .post('/tree', async (c) => {
    const data: {
      trees: Tree[];
      surveys: (SurveyHistory & { code: string })[];
      treeCodes: TreeCode[];
    } = await c.req.json();
    if (data.trees === undefined || data.surveys === undefined) {
      return c.json({ message: 'No data provided' }, 400);
    }
    const trees = data.trees;

    const surveys = data.surveys;
    const dir = '/uploads/survey-history/';

    const treeCodes = data.treeCodes;

    const resultTrees: {
      id: number;
      status: number;
    }[] = [];

    const resultSurveys: {
      id: number;
      status: number;
    }[] = [];

    const resultTreeCodes: {
      id: number;
      status: number;
    }[] = [];

    try {
      await db.transaction(async (tx) => {
        for (const tree of trees) {
          try {
            const upload = await tx.insert(treeSchema).values(tree);
            if (upload) {
              resultTrees.push({ id: tree.id, status: 1 });
            } else {
              resultTrees.push({ id: tree.id, status: 0 });
            }
          } catch (error) {
            console.error('Error inserting tree:', error);
            resultTrees.push({ id: tree.id, status: 0 });
          }
        }
      });
      await db.transaction(async (tx) => {
        for (const survey of surveys) {
          try {
            const {
              id,
              treeImage,
              leafImage,
              skinImage,
              fruitImage,
              flowerImage,
              sapImage,
              otherImage,
              ...rest
            } = survey;

            const listTreeImage = treeImage.map((image) => {
              return dir + image;
            });
            const listLeafImage = leafImage ? leafImage.map((image) => dir + image) : null;
            const listSkinImage = skinImage ? skinImage.map((image) => dir + image) : null;
            const listFruitImage = fruitImage ? fruitImage.map((image) => dir + image) : null;
            const listFlowerImage = flowerImage ? flowerImage.map((image) => dir + image) : null;
            const listSapImage = sapImage ? sapImage.map((image) => dir + image) : null;
            const listOtherImage = otherImage ? otherImage.map((image) => dir + image) : null;

            const upload = await tx.insert(surveyHistorySchema).values({
              ...rest,
              treeImage: listTreeImage,
              leafImage: listLeafImage,
              skinImage: listSkinImage,
              fruitImage: listFruitImage,
              flowerImage: listFlowerImage,
              sapImage: listSapImage,
              otherImage: listOtherImage,
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

        for (const treeCode of treeCodes) {
          try {
            const update = await tx
              .update(treeCodeSchema)
              .set(treeCode)
              .where(eq(treeCodeSchema.id, treeCode.id));
            if (update) {
              resultTreeCodes.push({ id: treeCode.id, status: 1 });
            } else {
              resultTreeCodes.push({ id: treeCode.id, status: 0 });
            }
          } catch (error) {
            console.error('Error updating tree code:', error);
          }
        }
      });
      return c.json(
        { message: 'Mass upload success', resultTrees, resultSurveys, resultTreeCodes },
        201
      );
    } catch (error) {
      console.error('Error mass upload:', error);
      return c.json(
        { message: 'Error mass upload', resultTrees, resultSurveys, resultTreeCodes },
        500
      );
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
