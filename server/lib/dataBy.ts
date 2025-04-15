/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';
import type { Context } from 'hono';
import type { BlankInput } from 'hono/types';

import { db } from '../db/database.js';
import { toCamelCase } from './utils.js';

export async function getDataBy(
  c: Context<object, any, BlankInput>,
  table: MySqlTableWithColumns<any>,
  getBy: string = 'id',
  valueTypeData: 'string' | 'number' = 'number'
) {
  const value = valueTypeData === 'number' ? parseInt(c.req.param(getBy)) : c.req.param(getBy);
  const data = await db
    .select()
    .from(table)
    .where(eq(table[toCamelCase(getBy) as keyof typeof table as string], value))
    .limit(1);

  return data[0] ? c.json({ data: data[0] }) : c.notFound();
}
