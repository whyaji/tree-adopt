import { eq, inArray } from 'drizzle-orm';
import { Hono } from 'hono';

import { STATUS_RECORD } from '../constants/STATUS_RECORD.js';
import { db } from '../db/database.js';
import {
  boundaryMarkerCodeSchema,
  boundaryMarkerSchema,
  checkBoundaryMarkerHistorySchema,
  masterTreeSchema,
  surveyHistorySchema,
  treeCodeSchema,
  treeSchema,
} from '../db/schema/schema.js';
import { massUploadFiles } from '../lib/upload.js';
import authMiddleware from '../middleware/jwt.js';
import type { BoundaryMarker } from './boundary-marker/boundaryMarker.js';
import type { CheckBoundaryMarkerHistory } from './boundary-marker/boundaryMarkerCheckHistory.js';
import type { BoundaryMarkerCode } from './boundary-marker/boundaryMarkerCode.js';
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

    const failedTreeUploadsCode: string[] = [];

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
              resultTrees.push({ id: id, status: STATUS_RECORD.UPLOADED });
            } else {
              resultTrees.push({
                id: id,
                status: STATUS_RECORD.FAILED,
                message: 'Failed to insert tree',
              });
              failedTreeUploadsCode.push(tree.code);
            }
          } catch (error) {
            console.error('Error inserting tree:', error);
            resultTrees.push({ id: tree.id, status: STATUS_RECORD.FAILED, message: String(error) });
            failedTreeUploadsCode.push(tree.code);
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

            const treeFailedInNewTree = failedTreeUploadsCode.find((treeCode) => treeCode === code);
            if (treeFailedInNewTree) {
              resultSurveys.push({
                id: survey.id,
                status: STATUS_RECORD.FAILED,
                message: 'Your Tree Failed to Upload',
              });
              continue;
            }

            const tree = treesForSurveyFromCode.find((tree) => tree.code === code);
            if (!tree) {
              resultSurveys.push({
                id: survey.id,
                status: STATUS_RECORD.FAILED,
                message: 'Tree not found',
              });
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
              resultSurveys.push({ id, status: STATUS_RECORD.UPLOADED });
            } else {
              resultSurveys.push({
                id,
                status: STATUS_RECORD.FAILED,
                message: 'Failed to insert survey',
              });
            }
          } catch (error) {
            console.error('Error inserting survey:', error);
            resultSurveys.push({
              id: survey.id,
              status: STATUS_RECORD.FAILED,
              message: String(error),
            });
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
              resultTreeCodes.push({ id: id, status: STATUS_RECORD.UPLOADED });
            } else {
              resultTreeCodes.push({
                id: id,
                status: STATUS_RECORD.FAILED,
                message: 'Failed to insert tree code',
              });
            }
          } catch (error) {
            console.error('Error inserting tree code:', error);
            resultTreeCodes.push({
              id: treeCode.id,
              status: STATUS_RECORD.FAILED,
              message: String(error),
            });
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
                status: STATUS_RECORD.FAILED,
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
              resultTreeCodesUpdate.push({ id, status: STATUS_RECORD.UPLOADED });
            } else {
              resultTreeCodesUpdate.push({ id, status: STATUS_RECORD.FAILED });
            }
          } catch (error) {
            console.error('Error updating tree code:', error);
            resultTreeCodesUpdate.push({
              id: treeCode.id,
              status: STATUS_RECORD.FAILED,
              message: String(error),
            });
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

  .post('/boundary-marker', async (c) => {
    const data: {
      boundaryMarkers: BoundaryMarker[];
      checkBoundaryMarkerHistories: Omit<CheckBoundaryMarkerHistory, 'boundaryMarkerId'>[];
      boundaryMarkerCodes: BoundaryMarkerCode[];
      boundaryMarkerCodesUpdate: BoundaryMarkerCode[];
    } = await c.req.json();

    if (data.boundaryMarkers === undefined || data.checkBoundaryMarkerHistories === undefined) {
      return c.json({ message: 'No data provided' }, 400);
    }
    const boundaryMarkers = data.boundaryMarkers;
    const checkBoundaryMarkerHistories = data.checkBoundaryMarkerHistories;
    const boundaryMarkerCodes = data.boundaryMarkerCodes;
    const boundaryMarkerCodesUpdate = data.boundaryMarkerCodesUpdate;
    const dir = '/uploads/boundary-marker/';
    const resultBoundaryMarkers: {
      id: number;
      status: number;
      message?: string;
    }[] = [];
    const failedBoundaryMarkerUploadsCode: string[] = [];
    const resultCheckBoundaryMarkerHistories: {
      id: number;
      status: number;
      message?: string;
    }[] = [];
    const resultBoundaryMarkerCodes: {
      id: number;
      status: number;
      message?: string;
    }[] = [];
    const resultBoundaryMarkerCodesUpdate: {
      id: number;
      status: number;
      message?: string;
    }[] = [];

    const boundaryMarkerCodeList = boundaryMarkerCodes.map((code) => code.code);
    const boundaryMarkerCodeListUpdate = boundaryMarkerCodesUpdate.map((code) => code.code);

    try {
      await db.transaction(async (tx) => {
        const sortedBoundaryMarkers = [...boundaryMarkers].sort((a, b) => a.id - b.id);
        for (const marker of sortedBoundaryMarkers) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, createdAt, updatedAt, deletedAt, ...rest } = marker;
            const upload = await tx.insert(boundaryMarkerSchema).values(rest);

            if (upload) {
              resultBoundaryMarkers.push({ id, status: STATUS_RECORD.UPLOADED });
            } else {
              resultBoundaryMarkers.push({
                id: id,
                status: STATUS_RECORD.FAILED,
                message: 'Failed to insert boundary marker',
              });
              failedBoundaryMarkerUploadsCode.push(marker.code);
            }
          } catch (error) {
            console.error('Error inserting boundary marker:', error);
            resultBoundaryMarkers.push({
              id: marker.id,
              status: STATUS_RECORD.FAILED,
              message: String(error),
            });
            failedBoundaryMarkerUploadsCode.push(marker.code);
          }
        }
      });

      const boundaryMarkersForCheckFromCode = await db
        .select({
          id: boundaryMarkerSchema.id,
          code: boundaryMarkerSchema.code,
        })
        .from(boundaryMarkerSchema)
        .where(inArray(boundaryMarkerSchema.code, boundaryMarkerCodeList));

      await db.transaction(async (tx) => {
        const sortedCheckHistories = [...checkBoundaryMarkerHistories].sort((a, b) => a.id - b.id);
        for (const checkHistory of sortedCheckHistories) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, createdAt, updatedAt, deletedAt, boundaryMarkerCode, images, ...rest } =
              checkHistory;

            const markerFailedInNewTree = failedBoundaryMarkerUploadsCode.find(
              (markerCode) => markerCode === boundaryMarkerCode
            );
            if (markerFailedInNewTree) {
              resultCheckBoundaryMarkerHistories.push({
                id: checkHistory.id,
                status: STATUS_RECORD.FAILED,
                message: 'Your Boundary Marker Failed to Upload',
              });
              continue;
            }
            const marker = boundaryMarkersForCheckFromCode.find(
              (marker) => marker.code === boundaryMarkerCode
            );
            if (!marker) {
              resultCheckBoundaryMarkerHistories.push({
                id: checkHistory.id,
                status: STATUS_RECORD.FAILED,
                message: 'Boundary marker not found',
              });
              continue;
            }
            const listImages = images.map((image) => {
              return dir + image;
            });
            const upload = await tx.insert(checkBoundaryMarkerHistorySchema).values({
              boundaryMarkerId: marker.id,
              boundaryMarkerCode,
              ...rest,
              images: listImages,
            });
            if (upload) {
              resultCheckBoundaryMarkerHistories.push({ id, status: STATUS_RECORD.UPLOADED });
            } else {
              resultCheckBoundaryMarkerHistories.push({
                id,
                status: STATUS_RECORD.FAILED,
                message: 'Failed to insert check boundary marker history',
              });
            }
          } catch (error) {
            console.error('Error inserting check boundary marker history:', error);
            resultCheckBoundaryMarkerHistories.push({
              id: checkHistory.id,
              status: STATUS_RECORD.FAILED,
              message: String(error),
            });
          }
        }
      });
      await db.transaction(async (tx) => {
        const sortedBoundaryMarkerCodes = [...boundaryMarkerCodes].sort((a, b) => a.id - b.id);
        for (const markerCode of sortedBoundaryMarkerCodes) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, createdAt, updatedAt, deletedAt, ...rest } = markerCode;
            const upload = await tx.insert(boundaryMarkerCodeSchema).values(rest);
            if (upload) {
              resultBoundaryMarkerCodes.push({ id: id, status: STATUS_RECORD.UPLOADED });
            } else {
              resultBoundaryMarkerCodes.push({
                id: id,
                status: STATUS_RECORD.FAILED,
                message: 'Failed to insert boundary marker code',
              });
            }
          } catch (error) {
            console.error('Error inserting boundary marker code:', error);
            resultBoundaryMarkerCodes.push({
              id: markerCode.id,
              status: STATUS_RECORD.FAILED,
              message: String(error),
            });
          }
        }
      });

      const boundaryMarkerCodesToUpdate = await db
        .select({
          id: boundaryMarkerCodeSchema.id,
          code: boundaryMarkerCodeSchema.code,
        })
        .from(boundaryMarkerCodeSchema)
        .where(inArray(boundaryMarkerCodeSchema.code, boundaryMarkerCodeListUpdate));

      await db.transaction(async (tx) => {
        for (const markerCode of boundaryMarkerCodesUpdate) {
          try {
            const markerCodeToUpdate = boundaryMarkerCodesToUpdate.find(
              (markerCodeToUpdate) => markerCodeToUpdate.code === markerCode.code
            );
            if (!markerCodeToUpdate) {
              resultBoundaryMarkerCodesUpdate.push({
                id: markerCode.id,
                status: STATUS_RECORD.FAILED,
                message: 'Boundary marker code not found',
              });
              continue;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, createdAt, updatedAt, deletedAt, ...rest } = markerCode;
            const update = await tx
              .update(boundaryMarkerCodeSchema)
              .set({
                id: markerCodeToUpdate.id,
                ...rest,
              })
              .where(eq(boundaryMarkerCodeSchema.id, markerCodeToUpdate.id));
            if (update) {
              resultBoundaryMarkerCodesUpdate.push({ id, status: STATUS_RECORD.UPLOADED });
            } else {
              resultBoundaryMarkerCodesUpdate.push({ id, status: STATUS_RECORD.FAILED });
            }
          } catch (error) {
            console.error('Error updating boundary marker code:', error);
            resultBoundaryMarkerCodesUpdate.push({
              id: markerCode.id,
              status: STATUS_RECORD.FAILED,
              message: String(error),
            });
          }
        }
      });
      return c.json(
        {
          message: 'Mass upload success',
          resultBoundaryMarkers,
          resultCheckBoundaryMarkerHistories,
          resultBoundaryMarkerCodes,
          resultBoundaryMarkerCodesUpdate,
        },
        201
      );
    } catch (error) {
      console.error('Error mass upload:', error);
      return c.json(
        {
          message: 'Error mass upload',
          error: String(error),
          resultBoundaryMarkers,
          resultCheckBoundaryMarkerHistories,
          resultBoundaryMarkerCodes,
          resultBoundaryMarkerCodesUpdate,
        },
        500
      );
    }
  })

  .post('/survey-images', async (c) => {
    return await massUploadFiles({ c, dir: 'survey-history/' });
  })

  .post('/boundary-marker-images', async (c) => {
    return await massUploadFiles({ c, dir: 'boundary-marker/' });
  });
