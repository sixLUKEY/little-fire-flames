import express from 'express';
import cors from 'cors';
import { routes } from './routes/routes';
import { initializeLocalDb } from './db';

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
    await initializeLocalDb();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

start();
