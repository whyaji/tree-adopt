/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';
import type { Context } from 'hono';
import type { BlankInput } from 'hono/types';

import { db } from '../db/database.js';
import {
  generateQueryOneToOne,
  getDataQueryOneToMany,
  reformatMainKey,
  type RelationsType,
} from './relation.js';
import { toCamelCase } from './utils.js';

export async function getDataBy({
  c,
  table,
  getBy = 'id',
  valueTypeData = 'number',
  relations,
  primaryKey = 'id',
}: {
  c: Context<object, any, BlankInput>;
  table: MySqlTableWithColumns<any>;
  getBy?: string;
  valueTypeData?: 'string' | 'number';
  relations?: RelationsType;
  primaryKey?: string;
}) {
  const valueId = valueTypeData === 'number' ? parseInt(c.req.param(getBy)) : c.req.param(getBy);
  const withString = c.req.query('with') ?? null;
  const withArray = withString ? (withString as string).split(',') : null;
  let query = db
    .select()
    .from(table)
    .where(eq(table[toCamelCase(getBy) as keyof typeof table as string], valueId));

  const oneToOneRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'one-to-one'
  );

  query = generateQueryOneToOne(query, table, oneToOneRelation, relations, withArray);

  const rawData = await query.limit(1);

  let data = !(withArray && relations && oneToOneRelation.length > 0)
    ? rawData
    : reformatMainKey(rawData, withArray);

  data =
    data.length > 0
      ? await getDataQueryOneToMany(data, primaryKey, undefined, undefined, relations, withArray)
      : [];

  return data[0] ? c.json({ data: data[0] }) : c.notFound();
}
