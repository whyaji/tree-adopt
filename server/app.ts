import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { authRoute } from './routes/auth.js';
import { kelompokKomunitasRoute } from './routes/kelompokkomunitas.js';
import { masterTreeRoute } from './routes/masterTree.js';
import { treeRoute } from './routes/tree.js';

const app = new Hono();

app.use('*', logger());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiRoutes = app
  .basePath('/api/v1')
  .route('/', authRoute)
  .route('/kelompok-komunitas', kelompokKomunitasRoute)
  .route('/master-tree', masterTreeRoute)
  .route('/tree', treeRoute);

app.get('*', serveStatic({ root: './frontend/dist' }));
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
