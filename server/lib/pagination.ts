/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, count, or } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';
import type { Context } from 'hono';
import type { BlankInput } from 'hono/types';

import { db } from '../db/database.js';
import { getAllConditions, parseFilterQuery } from './filter.js';
import { getSortDirection } from './order.js';
import { getSearchConditions } from './search.js';

export async function getPaginationData(
  c: Context<object, any, BlankInput>,
  table: MySqlTableWithColumns<any>,
  searchBy: string
) {
  const search = c.req.query('search') ?? '';
  const page = parseInt(c.req.query('page') ?? '1');
  const limit = parseInt(c.req.query('limit') ?? '10');
  const offset = (page - 1) * limit;
  const reqSearchBy = c.req.query('searchBy') ?? searchBy;

  const sortBy = c.req.query('sortBy') ?? 'createdAt';
  const order = c.req.query('order') ?? 'desc';

  if (!(sortBy in table)) {
    return c.json({ error: 'Invalid sortBy column' }, 400);
  }

  if (order !== 'asc' && order !== 'desc') {
    return c.json({ error: 'Invalid order' }, 400);
  }

  const filters = parseFilterQuery(c.req.query('filter') ?? null);
  const conditions = getAllConditions(filters, table);
  const whereClause = and(
    ...(search ? [or(...getSearchConditions(search, reqSearchBy, table))] : []),
    ...(conditions || [])
  );

  const [data, totalData] = await Promise.all([
    db
      .select()
      .from(table)
      .where(whereClause)
      .offset(offset)
      .limit(limit)
      .orderBy(getSortDirection(sortBy, order, table)),
    db.select({ count: count() }).from(table).where(whereClause),
  ]);

  const total = totalData[0]?.count ?? 0;

  return c.json({
    data,
    total,
    totalPage: Math.ceil(total / limit),
    page,
    limit,
  });
}
