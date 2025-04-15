import { like } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';

import { toCamelCase } from './utils.js';

export function getSearchConditions(
  search: string,
  searchFrom: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: MySqlTableWithColumns<any>
) {
  const searchConditions = searchFrom.split(',').map((field) => {
    const column = table[toCamelCase(field) as keyof typeof table as string];
    return like(column, `%${search}%`);
  });
  return searchConditions;
}
