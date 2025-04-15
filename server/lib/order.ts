import { asc, desc } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';

import { toCamelCase } from './utils.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSortDirection(sortBy: string, order: string, table: MySqlTableWithColumns<any>) {
  const column = table[toCamelCase(sortBy) as keyof typeof table as string];
  const sortDirection = order === 'asc' ? asc(column) : desc(column);
  return sortDirection;
}
