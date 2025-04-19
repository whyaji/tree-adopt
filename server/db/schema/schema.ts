import { bigint, float, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const userSchema = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 255 }),
  role: int('role').default(1), // 0 = admin, 1 = user
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

export const masterTreeSchema = mysqlTable('master_tree', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  latinName: varchar('latin_name', { length: 255 }).notNull(),
  localName: varchar('local_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const treeSchema = mysqlTable('tree', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  code: varchar('code', { length: 255 }).notNull(),
  treeId: bigint('tree_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => masterTreeSchema.id),
  kelompokKomunitasId: bigint('kelompok_komunitas_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => kelompokKomunitasSchema.id),
  status: int('status').default(1), // 0 = inactive, 1 = active, 2 = adopted
  adoptedBy: bigint('adopted_by', { mode: 'number', unsigned: true }).references(
    () => userSchema.id
  ),
  category: int('category').notNull(), // 1 = pohon dewasa, 2 = pohon remaja, 3 = bibit
  diameter: float('diameter').notNull(),
  serapanCo2: float('serapan_co2').notNull(),
  landType: int('land_type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
