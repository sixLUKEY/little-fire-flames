import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context as LambdaContext,
} from 'aws-lambda';
import { handleRequest, handleRequestError } from './handler';
import { HttpAPIError } from './http/types';

/**
 * API Handler function
 * @param event
 * @param awsContext
 * @returns
 */
export async function handler(
  event: APIGatewayProxyEvent,
  awsContext?: LambdaContext
): Promise<APIGatewayProxyResult> {
  try {
    return await handleRequest(event, awsContext);
  } catch (err: unknown) {
    return handleRequestError(event, err as HttpAPIError);
  }
}
