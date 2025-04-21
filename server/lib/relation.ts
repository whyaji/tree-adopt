/* eslint-disable @typescript-eslint/no-explicit-any */
import { aliasedTable, and, eq } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';

import { db } from '../db/database.js';
import { getAllConditions, parseFilterQuery } from './filter.js';
import { getSortDirection } from './order.js';
import { toCamelCase } from './utils.js';

type OneToOneRelation = {
  type: 'one-to-one';
  table: MySqlTableWithColumns<any>;
  on: string;
};

type OneToManyRelation = {
  type: 'one-to-many';
  table: MySqlTableWithColumns<any>;
  on: string;
};

export type RelationsType = Record<string, OneToOneRelation | OneToManyRelation>;

export function reformatMainKey(rawData: any, withArray?: string[]) {
  return rawData.map((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
    const mainKey = Object.keys(row).find((key) => !withArray?.includes(key));

    const mainData = mainKey ? (row as any)[mainKey] : {};

    return {
      ...mainData,
      ...Object.fromEntries(
        Object.entries(row)
          .filter(([key]) => key !== mainKey && !withArray?.includes(key))
          .map(([key, value]) => [toCamelCase(key), value])
      ),
    };
  });
}

export function generateQueryOneToOne(
  query: any,
  table: MySqlTableWithColumns<any>,
  oneToOneRelation: string[],
  relations?: RelationsType,
  withArray?: string[] | null
) {
  let queryInFunction = query;
  if (withArray && relations && oneToOneRelation.length > 0) {
    for (const relation of withArray) {
      const relationObj = relations?.[relation];
      if (relationObj && relationObj.type === 'one-to-one') {
        const alias = aliasedTable(relationObj.table, relation.replace(/Id$/, ''));
        queryInFunction = queryInFunction.leftJoin(
          alias,
          eq(table[relation], alias[relationObj.on])
        );
      }
    }
  }
  return queryInFunction;
}

export async function getDataQueryOneToMany(
  data: any,
  primaryKey: string,
  sortBy?: string,
  order?: string,
  relations?: RelationsType,
  withArray?: string[] | null
) {
  let dataInFunction = data;
  const oneToManyRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'one-to-many'
  );

  const idsString: string = dataInFunction
    .map((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
      return (row as any)[primaryKey] as string;
    })
    .join(',');

  if (withArray && relations && oneToManyRelation.length > 0) {
    for (const relation of withArray) {
      const relationObj = relations?.[relation];
      if (!relationObj || relationObj.type !== 'one-to-many') continue;
      const queryOneToMany = db.select().from(relationObj.table);
      const filterDataOneToManyString = `${relationObj.on}:${idsString}:in`;
      const filterDataOneToMany = parseFilterQuery(filterDataOneToManyString);
      const conditionsOneToMany = getAllConditions(filterDataOneToMany, relationObj.table);
      const whereClauseOneToMany = and(...(conditionsOneToMany || []));
      const dataOneToManyQuery = queryOneToMany.where(whereClauseOneToMany);
      if (sortBy && order) {
        dataOneToManyQuery.orderBy(getSortDirection(sortBy, order, relationObj.table));
      }
      const dataOneToManyResult = await dataOneToManyQuery;
      dataInFunction = dataInFunction.map((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
        return {
          ...row,
          [relation]: dataOneToManyResult.filter(
            (item: { [s: string]: unknown } | ArrayLike<unknown>) => {
              return (row as any)[primaryKey] === (item as any)[relationObj.on];
            }
          ),
        };
      });
    }
  }
  return dataInFunction;
}
