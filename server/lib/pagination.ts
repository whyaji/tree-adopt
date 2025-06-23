/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, count, or } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';
import type { Context } from 'hono';
import type { BlankInput } from 'hono/types';

import { db } from '../db/database.js';
import { getAllConditions, parseFilterQuery } from './filter.js';
import { getSortDirection } from './order.js';
import {
  extendWithArrayFromManyRelations,
  generateQueryOneToOne,
  getDataQueryLatestInserted,
  getDataQueryOneToMany,
  reformatFromManyToMany,
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
  selectObject,
  withData = null,
}: {
  c: Context<object, any, BlankInput>;
  table: MySqlTableWithColumns<any>;
  searchBy: string;
  relations?: RelationsType;
  primaryKey?: string;
  selectObject?: Record<string, any>;
  withData?: string | null;
}) {
  const sortBy = c.req.query('sortBy') ?? 'createdAt';
  const order = c.req.query('order') ?? 'desc';

  if (!(sortBy in table)) {
    return c.json({ error: 'Invalid sortBy column' }, 400);
  }

  if (order !== 'asc' && order !== 'desc') {
    return c.json({ error: 'Invalid order' }, 400);
  }

  const returnData = await getPaginationDataObject({
    c,
    table,
    searchBy,
    relations,
    primaryKey,
    selectObject,
    withData,
  });

  return c.json(returnData);
}

export async function getPaginationDataObject({
  c,
  table,
  searchBy,
  relations,
  primaryKey = 'id',
  selectObject,
  withData,
}: {
  c: Context<object, any, BlankInput>;
  table: MySqlTableWithColumns<any>;
  searchBy: string;
  relations?: RelationsType;
  primaryKey?: string;
  selectObject?: Record<string, any>;
  withData?: string | null;
}) {
  const search = c.req.query('search') ?? '';
  const page = parseInt(c.req.query('page') ?? '1');
  const limit = parseInt(c.req.query('limit') ?? '10');
  const offset = (page - 1) * limit;
  const reqSearchBy = c.req.query('searchBy') ?? searchBy;
  const withString = c.req.query('with') ? c.req.query('with') + `,${withData}` : withData ?? null;

  const sortBy = c.req.query('sortBy') ?? 'createdAt';
  const order = c.req.query('order') ?? 'desc';

  const selectFromQuery = c.req.query('select');
  const selectObjectFromQuery = selectFromQuery
    ? selectFromQuery.split(',').reduce((acc, key) => {
        acc[key] = table[key];
        return acc;
      }, {} as Record<string, any>)
    : null;

  const filters = parseFilterQuery(c.req.query('filter') ?? null);
  const conditions = getAllConditions(filters, table);
  const whereClause = and(
    ...(search ? [or(...getSearchConditions(search, reqSearchBy, table))] : []),
    ...(conditions || [])
  );

  let query;

  if (selectObject) {
    query = db.select(selectObject).from(table).where(whereClause).limit(limit);
  } else if (selectObjectFromQuery) {
    query = db.select(selectObjectFromQuery).from(table).where(whereClause).limit(limit);
  } else {
    query = db.select().from(table).where(whereClause).limit(limit);
  }

  const withArrayList = withString ? (withString as string).split(',') : null;

  const manyToManyRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'many-to-many' && withArrayList?.includes(key)
  );

  const withArray =
    manyToManyRelation.length > 0
      ? extendWithArrayFromManyRelations(withArrayList, manyToManyRelation, relations)
      : withArrayList;

  const oneToOneRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'one-to-one' && withArray?.includes(key)
  );

  query = generateQueryOneToOne(query, table, oneToOneRelation, relations, withArray)
    .where(whereClause)
    .orderBy(getSortDirection(sortBy, order, table))
    .offset(offset)
    .limit(limit);

  const totalData = await db.select({ count: count() }).from(table).where(whereClause);
  const rawData = await query;

  let data =
    withArray && relations && oneToOneRelation.length > 0
      ? reformatMainKey(rawData, withArray)
      : rawData;

  data =
    data.length > 0
      ? await getDataQueryOneToMany(data, primaryKey, sortBy, order, relations, withArray)
      : [];

  data =
    withArray && relations && manyToManyRelation.length > 0
      ? reformatFromManyToMany(data, manyToManyRelation, relations, withArray)
      : data;

  data =
    data.length > 0
      ? await getDataQueryLatestInserted(
          data,
          primaryKey,
          'createdAt',
          'desc',
          relations,
          withArray
        )
      : [];

  const total = totalData[0]?.count ?? 0;

  return {
    data,
    total,
    totalPage: Math.ceil(total / limit),
    page,
    limit,
  };
}
