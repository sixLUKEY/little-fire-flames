import express from 'express';
import cors from 'cors';
import { routes } from './routes/routes';
import { sequelize } from './db';
import './db/models/learner.model';
import './db/models/class.model';
import './db/models/subjects.model';
import './db/models/teachers.model';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Debug: Log all registered routes
console.log('\n📋 Registering routes:');

// Convert route definitions to Express routes
routes.forEach((route) => {
  const expressMethod = route.httpMethod.toLowerCase();
  const path = route.resourcePath.replace(/{(\w+)}/g, ':$1');

  console.log(`  ${expressMethod.toUpperCase().padEnd(6)} ${path}`);

  // Properly register Express routes using the method directly
  switch (expressMethod) {
    case 'get':
      app.get(path, async (req: express.Request, res: express.Response) => {
        try {
          const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const params = { id };
          const result = await route.handler({ params, body: req.body, event: req as any });
          res.status(result.statusCode).json(result.body);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      break;
    case 'post':
      app.post(path, async (req: express.Request, res: express.Response) => {
        console.log('CALLED POST');
        try {
          // For POST, extract id from body or params
          const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const params = {
            id: req.body?.studentId || req.body?.id || req.body?.classId || req.body?.subjectId || req.body?.teacherId || paramId,
          };
          const result = await route.handler({ params, body: req.body, event: req as any });
          res.status(result.statusCode).json(result.body);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      break;
    case 'put':
      app.put(path, async (req: express.Request, res: express.Response) => {
        try {
          const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const params = {
            id: paramId || req.body?.studentId || req.body?.id || req.body?.classId || req.body?.subjectId || req.body?.teacherId,
          };
          const result = await route.handler({ params, body: req.body, event: req as any });
          res.status(result.statusCode).json(result.body);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      break;
    case 'delete':
      app.delete(path, async (req: express.Request, res: express.Response) => {
        try {
          const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
          const params = { 
            id: paramId || req.body?.studentId || req.body?.id || req.body?.classId || req.body?.subjectId || req.body?.teacherId 
          };
          const result = await route.handler({ params, body: req.body, event: req as any });
          res.status(result.statusCode).json(result.body);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });
      break;
    default:
      console.warn(`⚠️  Unsupported HTTP method: ${expressMethod}`);
  }
});

console.log('');

// Debug endpoint to verify routes
app.get('/debug/routes', (req, res) => {
  const routeList = routes.map((route) => ({
    method: route.httpMethod,
    path: route.resourcePath,
    expressPath: route.resourcePath.replace(/{(\w+)}/g, ':$1'),
  }));
  res.json({ routes: routeList, total: routeList.length });
});

// Initialize database and start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync models (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔍 Debug routes at http://localhost:${PORT}/debug/routes\n`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

start();
