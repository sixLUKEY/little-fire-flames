import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { dispatch } from './router';
import { HttpAPIError } from './http/types';
import { HttpStatusCode } from './http/types';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Content-Type': 'application/json',
};

let dbInitialized = false;

async function ensureDb(): Promise<void> {
  if (dbInitialized) return;
  const { sequelize } = await import('./db');
  await import('./db/models/learner.model');
  await import('./db/models/class.model');
  await import('./db/models/subjects.model');
  await import('./db/models/teachers.model');
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  dbInitialized = true;
}

export const handleRequest = async (
  event: APIGatewayProxyEvent,
  _context?: Context
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  try {
    await ensureDb();
  } catch (err) {
    console.error('DB init failed:', err);
    return {
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      headers: CORS_HEADERS,
      body: JSON.stringify({ message: 'Service unavailable' }),
    };
  }

  try {
    const result = await dispatch({
      method: event.httpMethod,
      path: event.path,
      body: event.body ?? undefined,
      pathParameters: event.pathParameters
        ? (event.pathParameters as Record<string, string>)
        : undefined,
    });

    return {
      statusCode: result.statusCode,
      headers: CORS_HEADERS,
      body: result.body != null ? JSON.stringify(result.body) : '',
    };
  } catch (err) {
    return handleRequestError(event, err as HttpAPIError);
  }
};

export const handleRequestError = (
  _event: APIGatewayProxyEvent,
  error: HttpAPIError
): APIGatewayProxyResult => {
  const statusCode = error.statusCode ?? HttpStatusCode.INTERNAL_SERVER_ERROR;
  const body = { message: error.message ?? 'Internal server error' };
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
};
