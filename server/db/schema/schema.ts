import { bigint, double, float, int, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const userSchema = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  avatar: varchar('avatar', { length: 255 }),
  role: int('role').default(1), // 0 = admin, 1 = user
  groupId: bigint('group_id', { mode: 'number', unsigned: true }).references(
    () => kelompokKomunitasSchema.id
  ),
  reset_token: varchar('reset_token', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
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
  deletedAt: timestamp('deleted_at'),
});

export const masterTreeSchema = mysqlTable('master_tree', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  latinName: varchar('latin_name', { length: 255 }).notNull(),
  localName: varchar('local_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const treeSchema = mysqlTable('tree', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  code: varchar('code', { length: 255 }).notNull(),
  masterTreeId: bigint('master_tree_id', { mode: 'number', unsigned: true }).references(
    () => masterTreeSchema.id
  ),
  localTreeName: varchar('local_tree_name', { length: 255 }).notNull(),
  latinTreeName: varchar('latin_tree_name', { length: 255 }),
  kelompokKomunitasId: bigint('kelompok_komunitas_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => kelompokKomunitasSchema.id),
  surveyorId: bigint('surveyor_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => userSchema.id),
  status: int('status').default(1), // 0 = inactive, 1 = active
  elevation: float('elevation'),
  landType: varchar('land_type', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  latitude: double('latitude').notNull(),
  longitude: double('longitude').notNull(),
  sitterName: varchar('sitter_name', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const adoptHistorySchema = mysqlTable('adopt_history', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  treeId: bigint('tree_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => treeSchema.id),
  userId: bigint('user_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => userSchema.id),
  startDate: varchar('adopted_at', { length: 255 }).notNull(),
  endDate: varchar('end_date', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const surveyHistorySchema = mysqlTable('survey_history', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  treeId: bigint('tree_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => treeSchema.id),
  userId: bigint('user_id', { mode: 'number', unsigned: true })
    .notNull()
    .references(() => userSchema.id),
  surveyDate: varchar('survey_date', { length: 255 }).notNull(),
  surveyTime: varchar('survey_time', { length: 255 }).notNull(),
  category: int('category').notNull(), // 1 = pohon dewasa, 2 = pohon remaja, 3 = bibit
  diameter: float('diameter').notNull(),
  height: float('height').notNull(),
  serapanCo2: float('serapan_co2').notNull(),
  treeImage: varchar('tree_image', { length: 255 }).notNull(),
  leafImage: varchar('leaf_image', { length: 255 }),
  skinImage: varchar('skin_image', { length: 255 }),
  fruitImage: varchar('fruit_image', { length: 255 }),
  flowerImage: varchar('flower_image', { length: 255 }),
  sapImage: varchar('sap_image', { length: 255 }),
  otherImage: varchar('other_image', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
