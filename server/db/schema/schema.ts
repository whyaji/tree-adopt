import {
  bigint,
  double,
  float,
  index,
  int,
  json,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const userSchema = mysqlTable(
  'users',
  {
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
  },
  (table) => [index('group_id_idx_users').on(table.groupId)]
);

export const rolesSchema = mysqlTable('roles', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  code: varchar('code', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const permissionsSchema = mysqlTable('permissions', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  code: varchar('code', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  groupCode: varchar('group_code', { length: 255 }).notNull(),
  groupName: varchar('group_name', { length: 255 }).notNull(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const userHasRolesSchema = mysqlTable(
  'user_has_roles',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    userId: bigint('user_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => userSchema.id),
    roleId: bigint('role_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => rolesSchema.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('user_id_idx_user_has_roles').on(table.userId),
    index('role_id_idx_user_has_roles').on(table.roleId),
  ]
);

export const roleHasPermissionsSchema = mysqlTable(
  'role_has_permissions',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    roleId: bigint('role_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => rolesSchema.id),
    permissionId: bigint('permission_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => permissionsSchema.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('role_id_idx_role_has_permissions').on(table.roleId),
    index('permission_id_idx_role_has_permissions').on(table.permissionId),
  ]
);

export const kelompokKomunitasSchema = mysqlTable('kelompok_komunitas', {
  id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: varchar('description', { length: 255 }).notNull(),
  noSk: varchar('no_sk', { length: 255 }).notNull(),
  kups: varchar('kups', { length: 255 }).notNull(),
  programUnggulan: varchar('program_unggulan', { length: 255 }).notNull(),
  address: varchar('address', { length: 255 }).notNull(),
  latitude: double('latitude').notNull(),
  longitude: double('longitude').notNull(),
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

export const treeCodeSchema = mysqlTable(
  'tree_code',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    code: varchar('code', { length: 255 }).unique().notNull(),
    kelompokKomunitasId: bigint('kelompok_komunitas_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => kelompokKomunitasSchema.id),
    status: int('status').default(0), // 0 = untagged, 1 = tagged
    taggedBy: bigint('tagged_by', { mode: 'number', unsigned: true }).references(
      () => userSchema.id
    ),
    taggedAt: varchar('tagged_at', { length: 255 }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [index('kelompok_komunitas_id_idx_tree_code').on(table.kelompokKomunitasId)]
);

export const treeSchema = mysqlTable(
  'tree',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    code: varchar('code', { length: 255 }).unique().notNull(),
    masterTreeId: bigint('master_tree_id', { mode: 'number', unsigned: true }).references(
      () => masterTreeSchema.id
    ),
    localTreeName: varchar('local_tree_name', { length: 255 }).notNull(),
    kelompokKomunitasId: bigint('kelompok_komunitas_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => kelompokKomunitasSchema.id),
    surveyorId: bigint('surveyor_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => userSchema.id),
    status: int('status').default(1), // 0 = inactive, 1 = active
    elevation: float('elevation').notNull(),
    landCover: int('land_cover').notNull(), // 1 = gambut, 2 = hutan, 3 = pekarangan, 4 = tegalan, 5 = jalan,
    latitude: double('latitude').notNull(),
    longitude: double('longitude').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [index('kelompok_komunitas_id_idx_tree').on(table.kelompokKomunitasId)]
);

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

export const surveyHistorySchema = mysqlTable(
  'survey_history',
  {
    id: bigint('id', { mode: 'number', unsigned: true }).autoincrement().notNull().primaryKey(),
    treeId: bigint('tree_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => treeSchema.id),
    userId: bigint('user_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => userSchema.id),
    kelompokKomunitasId: bigint('kelompok_komunitas_id', { mode: 'number', unsigned: true })
      .notNull()
      .references(() => kelompokKomunitasSchema.id),
    surveyDate: varchar('survey_date', { length: 255 }).notNull(),
    surveyTime: varchar('survey_time', { length: 255 }).notNull(),
    category: int('category').notNull(), // 1 = pohon dewasa, 2 = pohon remaja, 3 = bibit
    circumference: float('circumference').notNull(),
    height: float('height').notNull(),
    serapanCo2: float('serapan_co2').notNull(),
    treeImage: json('tree_image').notNull(),
    leafImage: json('leaf_image'),
    skinImage: json('skin_image'),
    fruitImage: json('fruit_image'),
    flowerImage: json('flower_image'),
    sapImage: json('sap_image'),
    otherImage: json('other_image'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => [
    index('kelompok_komunitas_id_idx_survey_history').on(table.kelompokKomunitasId),
    index('tree_id_idx_survey_history').on(table.treeId),
  ]
);
