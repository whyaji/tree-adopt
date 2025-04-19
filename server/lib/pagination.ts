/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, count, or } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';
import type { Context } from 'hono';
import type { BlankInput } from 'hono/types';

import { db } from '../db/database.js';
import { getAllConditions, parseFilterQuery } from './filter.js';
import { getSortDirection } from './order.js';
import {
  generateQueryOneToOne,
  getDataQueryOneToMany,
  reformatMainKey,
  type RelationsType,
} from './relation.js';
import { getSearchConditions } from './search.js';

export async function getPaginationData({
  c,
  table,
  searchBy,
  relations,
  primaryKey = 'id',
}: {
  c: Context<object, any, BlankInput>;
  table: MySqlTableWithColumns<any>;
  searchBy: string;
  relations?: RelationsType;
  primaryKey?: string;
}) {
  const search = c.req.query('search') ?? '';
  const page = parseInt(c.req.query('page') ?? '1');
  const limit = parseInt(c.req.query('limit') ?? '10');
  const offset = (page - 1) * limit;
  const reqSearchBy = c.req.query('searchBy') ?? searchBy;
  const withString = c.req.query('with') ?? null;

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

  let query = db.select().from(table).where(whereClause).limit(limit);

  const withArray = withString ? (withString as string).split(',') : null;

  const oneToOneRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'one-to-one'
  );

  query = generateQueryOneToOne(query, table, oneToOneRelation, relations, withArray);

  const [rawData, totalData] = await Promise.all([
    (query as any)
      .where(whereClause)
      .orderBy(getSortDirection(sortBy, order, table))
      .offset(offset)
      .limit(limit),
    db.select({ count: count() }).from(table).where(whereClause),
  ]);

  let data = !(withArray && relations && oneToOneRelation.length > 0)
    ? rawData
    : reformatMainKey(rawData, withArray);

  data =
    data.length > 0
      ? await getDataQueryOneToMany(data, primaryKey, sortBy, order, relations, withArray)
      : [];

  const total = totalData[0]?.count ?? 0;

  return c.json({
    data,
    total,
    totalPage: Math.ceil(total / limit),
    page,
    limit,
  });
}
