import { zValidator } from '@hono/zod-validator';
import { and, eq, inArray, isNull } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import {
  adoptHistorySchema,
  kelompokKomunitasSchema,
  masterLocalTreeSchema,
  masterTreeSchema,
  surveyHistorySchema,
  treeSchema,
  userSchema,
} from '../db/schema/schema.js';
import { getDataBy } from '../lib/dataBy.js';
import { getPaginationData } from '../lib/pagination.js';
import type { RelationsType } from '../lib/relation.js';
import authMiddleware from '../middleware/jwt.js';

// === ZOD SCHEMAS ===
const treeSchemaZod = z.object({
  id: z.number().int().positive(),
  code: z.string().min(1),
  masterTreeId: z.number().int().positive().optional(),
  localTreeName: z.string().min(1),
  kelompokKomunitasId: z.number().int().positive(),
  surveyorId: z.number().int().positive(),
  status: z.number().int().default(1), // 0 = inactive, 1 = active
  elevation: z.number(),
  landCover: z.number().int(),
  latitude: z.number(),
  longitude: z.number(),
});

const createTreeSchema = treeSchemaZod.omit({
  id: true,
  masterTreeId: true,
  status: true,
});

export type Tree = z.infer<typeof treeSchemaZod>;

const adoptTreeJsonSchema = z.object({
  userId: z.number().int().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

// === RELATIONS ===
const relations: RelationsType = {
  surveyorId: {
    type: 'one-to-one',
    table: userSchema,
    on: 'id',
  },
  kelompokKomunitasId: {
    type: 'one-to-one',
    table: kelompokKomunitasSchema,
    on: 'id',
  },
  masterTreeId: {
    type: 'one-to-one',
    table: masterTreeSchema,
    on: 'id',
  },
  masterLocalTree: {
    type: 'one-to-many',
    table: masterLocalTreeSchema,
    on: 'masterTreeId',
    from: 'masterTreeId',
  },
  surveyHistory: {
    type: 'one-to-many',
    table: surveyHistorySchema,
    on: 'treeId',
    child: {
      'surveyHistory.userId': {
        type: 'one-to-one',
        table: userSchema,
        on: 'id',
        from: 'userId',
        alias: 'user',
      },
    },
  },
  survey: {
    type: 'latest-inserted',
    table: surveyHistorySchema,
    on: 'treeId',
    child: {
      'survey.userId': {
        type: 'one-to-one',
        table: userSchema,
        on: 'id',
        from: 'userId',
        alias: 'user',
      },
    },
  },
  adoptHistory: {
    type: 'one-to-many',
    table: adoptHistorySchema,
    on: 'treeId',
    child: {
      'adoptHistory.userId': {
        type: 'one-to-one',
        table: userSchema,
        on: 'id',
        from: 'userId',
        alias: 'user',
      },
    },
  },
  adopter: {
    type: 'latest-inserted',
    table: adoptHistorySchema,
    on: 'treeId',
    child: {
      'adopter.userId': {
        type: 'one-to-one',
        table: userSchema,
        on: 'id',
        from: 'userId',
        alias: 'user',
      },
    },
  },
};

// === ROUTES ===
export const treeRoute = new Hono()
  .use(authMiddleware)

  .get('/', async (c) => {
    return await getPaginationData({
      c,
      table: treeSchema,
      searchBy: 'code,kelompokKomunitasId,localTreeName,latinTreeName,address',
      relations,
    });
  })

  .post('/', zValidator('json', createTreeSchema), async (c) => {
    const tree = c.req.valid('json');
    await db.insert(treeSchema).values(tree);
    return c.json({ message: 'Tree created' }, 201);
  })

  .get('/:id{[0-9]+}', async (c) => {
    return await getDataBy({ c, table: treeSchema, relations });
  })

  .put('/:id{[0-9]+}', zValidator('json', treeSchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const tree = c.req.valid('json');
    const updated = await db.update(treeSchema).set(tree).where(eq(treeSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Tree updated' });
  })

  .put(
    '/:id{[0-9]+}/update-local-name',
    zValidator(
      'json',
      z.object({
        localTreeName: z.string().min(1),
      })
    ),
    async (c) => {
      const id = parseInt(c.req.param('id'));
      const { localTreeName } = c.req.valid('json');

      const updated = await db
        .update(treeSchema)
        .set({ localTreeName })
        .where(eq(treeSchema.id, id));

      if (!updated) {
        return c.notFound();
      }
      return c.json({ message: 'Local name updated' });
    }
  )

  // adopt tree
  .post('/:id{[0-9]+}/adopt', zValidator('json', adoptTreeJsonSchema), async (c) => {
    const id = parseInt(c.req.param('id'));
    const adoptDataReq = c.req.valid('json');

    const adoptData: z.infer<typeof adoptTreeJsonSchema> & {
      treeId: number;
    } = {
      ...adoptDataReq,
      treeId: id,
    };

    try {
      await db.insert(adoptHistorySchema).values(adoptData);
      return c.json({ message: 'Tree adopted' });
    } catch (error) {
      console.error('Error adopting tree:', error);
      return c.json({ error: 'Failed to adopt tree' }, 500);
    }
  })

  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db.delete(treeSchema).where(eq(treeSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Tree deleted' });
  })

  .put('/mass-assign-master-tree', async (c) => {
    // check params for kelompokKomunitasId
    const { kelompokKomunitasId } = c.req.query();

    const whereClause = isNull(treeSchema.masterTreeId);
    const treeQuery = db
      .select({
        id: treeSchema.id,
        code: treeSchema.code,
        localTreeName: treeSchema.localTreeName,
        kelompokKomunitasId: treeSchema.kelompokKomunitasId,
        masterTreeId: treeSchema.masterTreeId,
      })
      .from(treeSchema)
      .where(
        kelompokKomunitasId
          ? and(whereClause, eq(treeSchema.kelompokKomunitasId, Number(kelompokKomunitasId)))
          : whereClause
      );

    const trees = await treeQuery;

    const treeLocalNameList = trees.map((tree) => tree.localTreeName);

    const masterTreesSelected = await db
      .select({
        id: masterLocalTreeSchema.id,
        masterTreeId: masterLocalTreeSchema.masterTreeId,
        localName: masterLocalTreeSchema.localName,
      })
      .from(masterLocalTreeSchema)
      .where(inArray(masterLocalTreeSchema.localName, treeLocalNameList));

    if (masterTreesSelected.length === 0) {
      return c.json({
        message: 'No master trees found for the given local tree names',
        data: [],
        kelompokKomunitasId: kelompokKomunitasId ? Number(kelompokKomunitasId) : null,
      });
    }

    const treesToUpdate = trees.map((tree) => {
      const masterTree = masterTreesSelected.find((mt) => mt.localName === tree.localTreeName);
      return {
        id: tree.id,
        code: tree.code,
        localTreeName: tree.localTreeName,
        masterTreeId: masterTree ? masterTree.masterTreeId : null,
      };
    });

    const treesWithMasterTreeId = treesToUpdate.filter((tree) => tree.masterTreeId !== null);

    const updatePromises = treesWithMasterTreeId.map((tree) => {
      return db
        .update(treeSchema)
        .set({ masterTreeId: tree.masterTreeId })
        .where(eq(treeSchema.id, tree.id));
    });
    await Promise.all(updatePromises);

    return c.json({
      message: 'Master trees assigned successfully',
      data: treesWithMasterTreeId,
      kelompokKomunitasId: kelompokKomunitasId ? Number(kelompokKomunitasId) : null,
    });
  });
