import { eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';

import { db } from '../db/database.js';
import {
  masterTreeSchema,
  surveyHistorySchema,
  treeCodeSchema,
  treeSchema,
} from '../db/schema/schema.js';
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
      surveys: (Omit<SurveyHistory, 'treeId'> & { code: string })[];
      treeCodes: TreeCode[];
      treeCodesUpdate: TreeCode[];
    } = await c.req.json();
    if (data.trees === undefined || data.surveys === undefined) {
      return c.json({ message: 'No data provided' }, 400);
    }
    const trees = data.trees;

    const surveys = data.surveys;
    const dir = '/uploads/survey-history/';

    const treeCodes = data.treeCodes;
    const treeCodesUpdate = data.treeCodesUpdate;

    const resultTrees: {
      id: number;
      status: number;
      message?: string;
    }[] = [];

    const resultSurveys: {
      id: number;
      status: number;
      message?: string;
    }[] = [];

    const resultTreeCodes: {
      id: number;
      status: number;
      message?: string;
    }[] = [];

    const resultTreeCodesUpdate: {
      id: number;
      status: number;
      message?: string;
    }[] = [];

    // separate list code in survey
    const surveyCodeList = surveys.map((survey) => survey.code);

    const treeCodeListUpdate = treeCodesUpdate.map((treeCode) => treeCode.code);

    const treeLocalNameList = trees.map((tree) => tree.localTreeName);

    try {
      const masterTreesSelected = await db
        .select({
          id: masterTreeSchema.id,
          localName: masterTreeSchema.localName,
        })
        .from(masterTreeSchema)
        .where(inArray(masterTreeSchema.localName, treeLocalNameList));
      await db.transaction(async (tx) => {
        const sortedTrees = [...trees].sort((a, b) => a.id - b.id);
        for (const tree of sortedTrees) {
          try {
            const masterTree = masterTreesSelected.find(
              (masterTree) => masterTree.localName === tree.localTreeName
            );

            const { id, ...rest } = tree;
            const upload = await tx
              .insert(treeSchema)
              .values({ ...rest, masterTreeId: masterTree?.id ?? null });
            if (upload) {
              resultTrees.push({ id: id, status: 1 });
            } else {
              resultTrees.push({ id: id, status: 0, message: 'Failed to insert tree' });
            }
          } catch (error) {
            console.error('Error inserting tree:', error);
            resultTrees.push({ id: tree.id, status: 0, message: String(error) });
          }
        }
      });

      const treesForSurveyFromCode = await db
        .select({
          id: treeSchema.id,
          code: treeSchema.code,
        })
        .from(treeSchema)
        .where(inArray(treeSchema.code, surveyCodeList));

      await db.transaction(async (tx) => {
        const sortedSurveys = [...surveys].sort((a, b) => a.id - b.id);
        for (const survey of sortedSurveys) {
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
              resultSurveys.push({ id: survey.id, status: 0, message: 'Tree not found' });
              continue;
            }

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
              treeId: tree.id,
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
              resultSurveys.push({ id, status: 0, message: 'Failed to insert survey' });
            }
          } catch (error) {
            console.error('Error inserting survey:', error);
            resultSurveys.push({ id: survey.id, status: 0, message: String(error) });
          }
        }
      });

      await db.transaction(async (tx) => {
        const sortedTreeCodes = [...treeCodes].sort((a, b) => a.id - b.id);
        for (const treeCode of sortedTreeCodes) {
          try {
            const { id, ...rest } = treeCode;
            const upload = await tx.insert(treeCodeSchema).values(rest);
            if (upload) {
              resultTreeCodes.push({ id: id, status: 1 });
            } else {
              resultTreeCodes.push({ id: id, status: 0, message: 'Failed to insert tree code' });
            }
          } catch (error) {
            console.error('Error inserting tree code:', error);
            resultTreeCodes.push({ id: treeCode.id, status: 0, message: String(error) });
          }
        }
      });

      const treeCodesToUpdate = await db
        .select({
          id: treeCodeSchema.id,
          code: treeCodeSchema.code,
        })
        .from(treeCodeSchema)
        .where(inArray(treeCodeSchema.code, treeCodeListUpdate));

      await db.transaction(async (tx) => {
        for (const treeCode of treeCodesUpdate) {
          try {
            const treeCodeToUpdate = treeCodesToUpdate.find(
              (treeCodeToUpdate) => treeCodeToUpdate.code === treeCode.code
            );
            if (!treeCodeToUpdate) {
              resultTreeCodesUpdate.push({
                id: treeCode.id,
                status: 0,
                message: 'Tree code not found',
              });
              continue;
            }
            const { id, ...rest } = treeCode;
            const update = await tx
              .update(treeCodeSchema)
              .set({
                id: treeCodeToUpdate.id,
                ...rest,
              })
              .where(eq(treeCodeSchema.id, treeCodeToUpdate.id));
            if (update) {
              resultTreeCodesUpdate.push({ id, status: 1 });
            } else {
              resultTreeCodesUpdate.push({ id, status: 0 });
            }
          } catch (error) {
            console.error('Error updating tree code:', error);
            resultTreeCodesUpdate.push({ id: treeCode.id, status: 0, message: String(error) });
          }
        }
      });

      return c.json(
        {
          message: 'Mass upload success',
          resultTrees,
          resultSurveys,
          resultTreeCodes,
          resultTreeCodesUpdate,
        },
        201
      );
    } catch (error) {
      console.error('Error mass upload:', error);
      return c.json(
        {
          message: 'Error mass upload',
          error: String(error),
          resultTrees,
          resultSurveys,
          resultTreeCodes,
          resultTreeCodesUpdate,
        },
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
