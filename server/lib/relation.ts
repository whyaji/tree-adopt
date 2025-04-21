/* eslint-disable @typescript-eslint/no-explicit-any */
import { aliasedTable, and, eq } from 'drizzle-orm';
import type { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';

import { db } from '../db/database.js';
import { getAllConditions, parseFilterQuery } from './filter.js';
import { getSortDirection } from './order.js';
import { toCamelCase } from './utils.js';

type OneToOneRelation = {
  type: 'one-to-one';
};

type OneToManyRelation = {
  type: 'one-to-many';
};

type LatestInsertedRelation = {
  type: 'latest-inserted';
};

export type RelationsType = Record<
  string,
  (OneToOneRelation | OneToManyRelation | LatestInsertedRelation) & {
    table: MySqlTableWithColumns<any>;
    on: string;
    from?: string;
    alias?: string;
    child?: RelationsType;
  }
>;

export function reformatMainKey(rawData: any, withArray?: string[]) {
  console.log('reformat');
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
        const alias = aliasedTable(
          relationObj.table,
          relationObj.alias ?? relation.replace(/Id$/, '')
        );
        queryInFunction = queryInFunction.leftJoin(
          alias,
          eq(table[relationObj.from ?? relation], alias[relationObj.on])
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
    (key) => relations?.[key].type === 'one-to-many' && withArray?.includes(key)
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
      const dataOneToManyResult = await recursionDataRelationChild(
        dataOneToManyQuery,
        primaryKey,
        relationObj,
        withArray
      );
      dataInFunction = dataInFunction.map((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
        return {
          ...row,
          [relationObj.alias ?? relation]: dataOneToManyResult.filter(
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

export async function getDataQueryLatestInserted(
  data: any,
  primaryKey: string,
  sortBy?: string,
  order?: string,
  relations?: RelationsType,
  withArray?: string[] | null
) {
  let dataInFunction = data;
  const latestInsertedRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'latest-inserted' && withArray?.includes(key)
  );

  const idsString: string = dataInFunction
    .map((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
      return (row as any)[primaryKey] as string;
    })
    .join(',');

  if (withArray && relations && latestInsertedRelation.length > 0) {
    for (const relation of withArray) {
      const relationObj = relations?.[relation];
      if (!relationObj || relationObj.type !== 'latest-inserted') continue;
      const queryOneToMany = db.select().from(relationObj.table);
      const filterDataOneToManyString = `${relationObj.on}:${idsString}:in`;
      const filterDataOneToMany = parseFilterQuery(filterDataOneToManyString);
      const conditionsOneToMany = getAllConditions(filterDataOneToMany, relationObj.table);
      const whereClauseOneToMany = and(...(conditionsOneToMany || []));
      const dataOneToManyQuery = queryOneToMany.where(whereClauseOneToMany);
      if (sortBy && order) {
        dataOneToManyQuery.orderBy(getSortDirection(sortBy, order, relationObj.table));
      }
      const dataOneToManyResult = await recursionDataRelationChild(
        dataOneToManyQuery,
        primaryKey,
        relationObj,
        withArray
      );
      dataInFunction = dataInFunction.map((row: { [s: string]: unknown } | ArrayLike<unknown>) => {
        return {
          ...row,
          [relationObj.alias ?? relation]:
            dataOneToManyResult.filter((item: { [s: string]: unknown } | ArrayLike<unknown>) => {
              return (row as any)[primaryKey] === (item as any)[relationObj.on];
            })?.[0] ?? null,
        };
      });
    }
  }
  return dataInFunction;
}

async function recursionDataRelationChild(
  dataOneToManyQuery: any,
  primaryKey: string,
  relationObj: RelationsType[string],
  withArray?: string[] | null
) {
  if (relationObj.child) {
    return await recursionDataRelation(
      dataOneToManyQuery,
      primaryKey,
      relationObj.table,
      relationObj.child,
      withArray
    );
  } else {
    return await dataOneToManyQuery;
  }
}

async function recursionDataRelation(
  query: any,
  primaryKey: string,
  table: MySqlTableWithColumns<any>,
  relations?: RelationsType,
  withArray?: string[] | null
) {
  const oneToOneRelation = Object.keys(relations ?? {}).filter(
    (key) => relations?.[key].type === 'one-to-one' && withArray?.includes(key)
  );
  query = generateQueryOneToOne(query, table, oneToOneRelation, relations, withArray);

  const rawData = await query;
  let data =
    withArray && relations && oneToOneRelation.length > 0
      ? reformatMainKey(rawData, withArray)
      : rawData;
  data =
    data.length > 0
      ? await getDataQueryOneToMany(data, primaryKey, undefined, undefined, relations, withArray)
      : [];

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
  return data;
}
