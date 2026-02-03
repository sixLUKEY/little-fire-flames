import { APIGatewayProxyEvent } from 'aws-lambda';

export type HttpMethod =
  | 'DELETE'
  | 'GET'
  | 'HEAD'
  | 'OPTIONS'
  | 'PATCH'
  | 'POST'
  | 'PUT';

export interface Params {
  id?: string;
}

export interface V1RequestOptions<TBody = any> {
  event?: APIGatewayProxyEvent;
  params: Params;
  body?: TBody;
}

export interface HttpRawResponse<
  T extends Record<string, any> = Record<string, any>,
> {
  statusCode: number;
  body?: T;
}

export type RouteHandler = (
  options: V1RequestOptions
) => Promise<HttpRawResponse>;
