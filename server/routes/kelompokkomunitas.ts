import { zValidator } from '@hono/zod-validator';
import { and, count, eq, like } from 'drizzle-orm';
import { Hono } from 'hono';
import { z } from 'zod';

import { db } from '../db/database.js';
import { kelompokKomunitasSchema } from '../db/schema/schema.js';
import { getAllConditions, parseFilterQuery } from '../lib/filter.js';
import authMiddleware from '../middleware/jwt.js';

const kelompokKomunitasSchemaZod = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3),
  description: z.string().min(3),
  noSk: z.string().min(3),
  kups: z.string().min(3),
  programUnggulan: z.string().min(3),
  latitude: z.string().min(3),
  longitude: z.string().min(3),
});

const createPostSchema = kelompokKomunitasSchemaZod.omit({ id: true });

export type KelompokKomunitas = z.infer<typeof kelompokKomunitasSchemaZod>;

export const kelompokKomunitasRoute = new Hono()
  .use(authMiddleware)
  .get('/', async (c) => {
    const search = c.req.query('search');
    const page = parseInt(c.req.query('page') ?? '1');
    const limit = parseInt(c.req.query('limit') ?? '10');
    const offset = (page - 1) * limit;
    const filterQuery = c.req.query('filter') ?? null;
    const filters = parseFilterQuery(filterQuery);
    const allConditions = getAllConditions(filters, kelompokKomunitasSchema);

    console.log({ filters, search, page, limit, offset });

    const query =
      search && search !== ''
        ? db
            .select()
            .from(kelompokKomunitasSchema)
            .where(and(like(kelompokKomunitasSchema.name, `%${search}%`), ...(allConditions || [])))
        : db
            .select()
            .from(kelompokKomunitasSchema)
            .where(and(...(allConditions || [])));

    // Execute the query with pagination
    const kelompokKomunitas = await query.limit(limit).offset(offset);

    // Get total count of kelompokKomunitas (with search filter if applicable)
    const totalQuery = db.select({ count: count() }).from(kelompokKomunitasSchema);
    if (search) {
      totalQuery.where(like(kelompokKomunitasSchema.name, `%${search}%`));
    }
    const total = await totalQuery;

    return c.json({
      data: kelompokKomunitas,
      total: total[0].count,
      totalPage: Math.ceil(total[0].count / limit),
      page,
      limit,
    });
  })
  .get('/total', async (c) => {
    const total = await db.select({ count: count() }).from(kelompokKomunitasSchema);
    return c.json({ total: total[0].count });
  })
  .post('/', zValidator('json', createPostSchema), async (c) => {
    // const formData = await c.req.parseBody();
    // const validationResult = createPostSchema.safeParse(formData);

    // if (!validationResult.success) {
    //   return c.json({ errors: validationResult.error.errors }, 400);
    // }

    // const kelompokKomunitas = validationResult.data;
    const kelompokKomunitas = c.req.valid('json');
    await db.insert(kelompokKomunitasSchema).values(kelompokKomunitas);
    return c.json({ message: 'Kelompok Komunitas created' }, 201);
  })
  .get('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const kelompokKomunitas = await db
      .select()
      .from(kelompokKomunitasSchema)
      .where(eq(kelompokKomunitasSchema.id, id))
      .limit(1);
    if (!kelompokKomunitas[0]) {
      return c.notFound();
    }
    return c.json({ data: kelompokKomunitas[0] });
  })
  .delete('/:id{[0-9]+}', async (c) => {
    const id = parseInt(c.req.param('id'));
    const deleted = await db
      .delete(kelompokKomunitasSchema)
      .where(eq(kelompokKomunitasSchema.id, id));
    if (!deleted) {
      return c.notFound();
    }
    return c.json({ message: 'Kelompok Komunitas deleted' });
  })
  .put('/:id{[0-9]+}', zValidator('json', kelompokKomunitasSchemaZod), async (c) => {
    const id = parseInt(c.req.param('id'));
    const kelompokKomunitas = c.req.valid('json');
    const updated = await db
      .update(kelompokKomunitasSchema)
      .set(kelompokKomunitas)
      .where(eq(kelompokKomunitasSchema.id, id));
    if (!updated) {
      return c.notFound();
    }
    return c.json({ message: 'Kelompok Komunitas updated' });
  });
