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

// Convert route definitions to Express routes
routes.forEach((route) => {
  const expressMethod = route.httpMethod.toLowerCase() as keyof typeof app;
  const path = route.resourcePath.replace(/{(\w+)}/g, ':$1');

  app[expressMethod](
    path,
    async (req: express.Request, res: express.Response) => {
      try {
        // For POST/PUT/PATCH, extract id from body if not in params
        const params = {
          id: req.params.id || req.body?.studentId || req.body?.id,
        };
        const result = await route.handler({ params, event: req as any });
        res.status(result.statusCode).json(result.body);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  );
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
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

start();
