import { bigint, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const userSchema = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  reset_token: varchar('reset_token', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const kelompokKomunitasSchema = mysqlTable('kelompok_komunitas', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: varchar('description', { length: 255 }).notNull(),
  noSk: varchar('no_sk', { length: 255 }).notNull(),
  kups: varchar('kups', { length: 255 }).notNull(),
  programUnggulan: varchar('program_unggulan', { length: 255 }).notNull(),
  latitude: varchar('latitude', { length: 255 }).notNull(),
  longitude: varchar('longitude', { length: 255 }).notNull(),
  image: varchar('image', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
