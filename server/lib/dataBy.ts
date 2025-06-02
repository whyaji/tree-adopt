/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';
import type { Context } from 'hono';
import type { BlankInput } from 'hono/types';

import { db } from '../db/database.js';
import {
  extendWithArrayFromManyRelations,
  extendWithArrayFromRelations,
  generateQueryOneToOne,
  getDataQueryLatestInserted,
  getDataQueryOneToMany,
  reformatFromManyToMany,
  reformatMainKey,
  type RelationsType,
} from './relation.js';
import { toCamelCase } from './utils.js';

export async function getDataBy({
  id,
  c,
  table,
  getBy = 'id',
  valueTypeData = 'number',
  relations,
  primaryKey = 'id',
  selectObject,
}: {
  id?: number | string;
  c: Context<object, any, BlankInput>;
  table: MySqlTableWithColumns<any>;
  getBy?: string;
  valueTypeData?: 'string' | 'number';
  relations?: RelationsType;
  primaryKey?: string;
  selectObject?: Record<string, any>;
}) {
  const idReqParam = valueTypeData === 'number' ? parseInt(c.req.param(getBy)) : c.req.param(getBy);
  const valueId = id ?? idReqParam;

  const withString = c.req.query('with') ?? null;
  const withArrayList = extendWithArrayFromRelations(
    withString ? (withString as string).split(',') : null
  );
  const manyToManyRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'many-to-many' && withArrayList?.includes(key)
  );

  const withArray =
    manyToManyRelation.length > 0
      ? extendWithArrayFromManyRelations(withArrayList, manyToManyRelation, relations)
      : withArrayList;

  let query;

  if (selectObject) {
    query = db
      .select(selectObject)
      .from(table)
      .where(eq(table[toCamelCase(getBy) as keyof typeof table as string], valueId));
  } else {
    query = db
      .select()
      .from(table)
      .where(eq(table[toCamelCase(getBy) as keyof typeof table as string], valueId));
  }

  const oneToOneRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'one-to-one' && withArray?.includes(key)
  );

  query = generateQueryOneToOne(query, table, oneToOneRelation, relations, withArray);

  const rawData = await query.limit(1);

  let data =
    withArray && relations && oneToOneRelation.length > 0
      ? reformatMainKey(rawData, withArray)
      : rawData;

  data =
    data.length > 0
      ? await getDataQueryOneToMany(data, primaryKey, undefined, undefined, relations, withArray)
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

  return data[0] ? c.json({ data: data[0] }) : c.notFound();
}
