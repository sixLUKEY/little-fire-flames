/**
 * Shared router: matches HTTP method + path to route definitions and invokes handlers.
 * Used by both Express (server.ts) and Lambda (handler.ts) so API Gateway → Lambda
 * and local Express behave the same.
 */

import { Params, HttpRawResponse, RouteHandler } from './types';
import { routes } from './routes/routes';

const PATH_PARAM = /\{(\w+)\}/g;

function pathToRegex(resourcePath: string): { regex: RegExp; keys: string[] } {
  const keys: string[] = [];
  const pattern = resourcePath.replace(PATH_PARAM, (_, key) => {
    keys.push(key);
    return '([^/]+)';
  });
  return { regex: new RegExp(`^${pattern}$`), keys };
}

export interface DispatchInput {
  method: string;
  path: string;
  body?: string | Record<string, unknown> | null;
  pathParameters?: Record<string, string | undefined> | null;
}

export interface DispatchResult {
  statusCode: number;
  body?: unknown;
}

/**
 * Find a route that matches method and path; returns the handler and parsed params.
 */
export function findRoute(
  method: string,
  path: string
): { route: (typeof routes)[0]; params: Params } | null {
  const normMethod = method.toUpperCase();
  const normPath = path.replace(/\?.*$/, ''); // strip query string

  for (const route of routes) {
    if (route.httpMethod !== normMethod) continue;
    const { regex, keys } = pathToRegex(route.resourcePath);
    const match = normPath.match(regex);
    if (!match) continue;
    const params: Params = {};
    const firstVal = keys.length > 0 ? match[1] : undefined;
    if (firstVal) params.id = firstVal;
    return { route, params };
  }
  return null;
}

/**
 * Dispatch a request to the appropriate handler. Used by Lambda and (optionally) Express.
 */
export async function dispatch(input: DispatchInput): Promise<DispatchResult> {
  const { method, path, pathParameters } = input;
  let body: Record<string, unknown> | undefined;
  if (typeof input.body === 'string') {
    try {
      body = input.body ? JSON.parse(input.body) : undefined;
    } catch {
      body = undefined;
    }
  } else {
    body = input.body ?? undefined;
  }

  const found = findRoute(method, path);
  if (!found) {
    return {
      statusCode: 404,
      body: { message: 'Not found', path, method },
    };
  }

  const params: Params = {
    ...found.params,
    id: found.params.id ?? pathParameters?.id,
  };
  const result = await found.route.handler({
    params,
    body,
    event: undefined,
  });

  return {
    statusCode: result.statusCode,
    body: result.body,
  };
}
