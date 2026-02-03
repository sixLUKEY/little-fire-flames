import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { HttpAPIError } from './http/types';

export const handleRequest = async (
  event: APIGatewayProxyEvent,
  context?: Context
): Promise<APIGatewayProxyResult> => {
  return {} as APIGatewayProxyResult;
};
export const handleRequestError = (
  event: APIGatewayProxyEvent,
  error: HttpAPIError
): APIGatewayProxyResult => {
  return {} as APIGatewayProxyResult;
};
