/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  not,
  notInArray,
  SQL,
  sql,
} from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';

import { toCamelCase } from './utils.js';

type FilterOperator =
  | 'in'
  | 'notin'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'like'
  | 'null'
  | 'notnull'
  | 'eq'
  | 'neq';
type FilterCondition = Record<string, Partial<Record<FilterOperator, string[]>>>;

/**
 * Parses a filter query string into a FilterCondition object
 * @param filterQuery The filter query string (e.g., "name:john,doe:in;age:20:gt")
 * @returns FilterCondition object or null if query is empty
 */
export function parseFilterQuery(filterQuery: string | null): FilterCondition | null {
  if (!filterQuery) {
    return null;
  }

  const conditions: FilterCondition = {};
  const filterParts = filterQuery.split(';');

  for (const filterPart of filterParts) {
    const filterPartParts = filterPart.split(':');
    if (filterPartParts.length > 3 || filterPartParts.length < 2) {
      continue;
    }

    const key = toCamelCase(filterPartParts[0]);
    const valueParts = filterPartParts[1].split(',');
    const operator = (filterPartParts[2] || 'in') as FilterOperator;

    conditions[key] = { [operator]: valueParts };
  }

  return conditions;
}

/**
 * Applies filters to a Drizzle query
 * @param filters The filter conditions
 * @returns An array of SQL conditions that can be used with Drizzle's where clause
 */
/**
 * Applies filters to a Drizzle query
 */
function applyDrizzleFilters(filters: FilterCondition, table: any): SQL[] {
  const conditions: SQL[] = [];

  for (const [key, condition] of Object.entries(filters)) {
    // Ensure the column exists in the table
    if (!(key in table)) continue;

    const column = table[key];

    for (const [operator, values] of Object.entries(condition)) {
      switch (operator) {
        case 'in':
          conditions.push(inArray(column, values));
          break;
        case 'notin':
          conditions.push(notInArray(column, values));
          break;
        case 'gt':
          conditions.push(gt(column, values[0]));
          break;
        case 'lt':
          conditions.push(lt(column, values[0]));
          break;
        case 'gte':
          conditions.push(gte(column, values[0]));
          break;
        case 'lte':
          conditions.push(lte(column, values[0]));
          break;
        case 'like':
          conditions.push(like(column, `%${values[0]}%`));
          break;
        case 'null':
          conditions.push(isNull(column));
          break;
        case 'notnull':
          conditions.push(isNotNull(column));
          break;
        default:
          conditions.push(inArray(column, values));
      }
    }
  }

  return conditions;
}

/**
 * Applies year/month filters to a Drizzle query
 * @param filters The filter conditions
 * @param column The column to filter by
 * @returns An array of SQL conditions for year/month filtering
 */
export function applyDrizzleYearMonthFilters(filters: FilterCondition, column: any): SQL[] {
  const conditions: SQL[] = [];
  const yearFilter = filters['year'];
  const monthFilter = filters['month'];

  if (yearFilter) {
    for (const [operator, values] of Object.entries(yearFilter)) {
      switch (operator) {
        case 'eq':
          conditions.push(eq(sql`YEAR(${column})`, values[0]));
          break;
        case 'neq':
          conditions.push(not(eq(sql`YEAR(${column})`, values[0])));
          break;
        case 'in':
          conditions.push(inArray(sql`YEAR(${column})`, values));
          break;
        case 'notin':
          conditions.push(notInArray(sql`YEAR(${column})`, values));
          break;
        case 'gt':
          conditions.push(gt(sql`YEAR(${column})`, values[0]));
          break;
        case 'lt':
          conditions.push(lt(sql`YEAR(${column})`, values[0]));
          break;
        case 'gte':
          conditions.push(gte(sql`YEAR(${column})`, values[0]));
          break;
        case 'lte':
          conditions.push(lte(sql`YEAR(${column})`, values[0]));
          break;
        default:
          conditions.push(inArray(sql`YEAR(${column})`, values));
      }
    }
  }

  if (monthFilter) {
    for (const [operator, values] of Object.entries(monthFilter)) {
      switch (operator) {
        case 'eq':
          conditions.push(eq(sql`MONTH(${column})`, values[0]));
          break;
        case 'neq':
          conditions.push(not(eq(sql`MONTH(${column})`, values[0])));
          break;
        case 'in':
          conditions.push(inArray(sql`MONTH(${column})`, values));
          break;
        case 'notin':
          conditions.push(notInArray(sql`MONTH(${column})`, values));
          break;
        case 'gt':
          conditions.push(gt(sql`MONTH(${column})`, values[0]));
          break;
        case 'lt':
          conditions.push(lt(sql`MONTH(${column})`, values[0]));
          break;
        case 'gte':
          conditions.push(gte(sql`MONTH(${column})`, values[0]));
          break;
        case 'lte':
          conditions.push(lte(sql`MONTH(${column})`, values[0]));
          break;
        default:
          conditions.push(inArray(sql`MONTH(${column})`, values));
      }
    }
  }

  return conditions;
}

export function getAllConditions(
  filters: FilterCondition | null,
  table: MySqlTableWithColumns<any>
) {
  if (filters) {
    // Apply regular filters
    const filterConditions = applyDrizzleFilters(filters, table);

    // Apply year/month filters if needed
    const yearMonthConditions = applyDrizzleYearMonthFilters(filters, table.createdAt);

    // Combine all conditions
    const allConditions = [...filterConditions, ...yearMonthConditions];

    if (allConditions.length > 0) {
      return allConditions;
    }
  }
}
