import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

import { authRoute } from './routes/auth.js';
import { kelompokKomunitasRoute } from './routes/kelompokkomunitas.js';
import { massUploadRoute } from './routes/massUpload.js';
import { masterTreeRoute } from './routes/masterTree.js';
import { surveyHistoryRoute } from './routes/surveyHistory.js';
import { treeRoute } from './routes/tree.js';
import { treeCodeRoute } from './routes/treeCode.js';
import { usersRoute } from './routes/users.js';

const app = new Hono();

app.use('*', logger());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const apiRoutes = app
  .basePath('/api/v1')
  .route('/', authRoute)
  .route('/users', usersRoute)
  .route('/kelompok-komunitas', kelompokKomunitasRoute)
  .route('/master-tree', masterTreeRoute)
  .route('/tree-code', treeCodeRoute)
  .route('/tree', treeRoute)
  .route('/survey-history', surveyHistoryRoute)
  .route('/adopt-history', authRoute)
  .route('/mass-upload', massUploadRoute);

// Serve files from uploads directory
app.get('/uploads/*', serveStatic({ root: './frontend/public' }));

// Serve static files from the built frontend
app.get('*', serveStatic({ root: './frontend/dist' }));

// Fallback to index.html for client-side routing
app.get('*', serveStatic({ path: './frontend/dist/index.html' }));

export default app;
export type ApiRoutes = typeof apiRoutes;
