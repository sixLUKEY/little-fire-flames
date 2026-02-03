export enum HttpStatusCode {
  // 200s - Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // 400s - Request Validation
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,

  // 500s - Internal errors (our fault)
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE_ERROR = 503,
}

export enum BadRequestErrorCode {
  MALFORMED_VALUE = 'MalformedValue',

  CLIENT_ERROR = 'ClientError',
}

export enum NotFoundErrorCode {
  NOT_FOUND = 'NotFound',
}

export enum ForbiddenErrorCode {
  FORBIDDEN = 'Forbidden',
}

export enum ConflictErrorCode {
  STATE_CONFLICT = 'StateConflict',
}

export enum TooManyRequestsErrorCode {
  TOO_MANY_REQUESTS = 'TooManyRequests',
}

export enum InternalErrorCode {
  INTERNAL_SERVER_ERROR = 'InternalServerError',
}

export enum ServiceUnavailableErrorCode {
  SERVICE_UNAVAILABLE_ERROR = 'ServiceUnavailableError',
}

type ErrorCode =
  | BadRequestErrorCode
  | ForbiddenErrorCode
  | NotFoundErrorCode
  | ConflictErrorCode
  | TooManyRequestsErrorCode
  | InternalErrorCode
  | ServiceUnavailableErrorCode;

interface Detail {
  target: string;
  message: string;
}

export class HttpAPIError extends Error {
  statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;

  errorCode: ErrorCode = InternalErrorCode.INTERNAL_SERVER_ERROR;

  details: Detail[] = [];
}

/**
 * 400 Error
 */
export class BadRequestError extends HttpAPIError {
  statusCode: HttpStatusCode = HttpStatusCode.BAD_REQUEST;

  errorCode: BadRequestErrorCode = BadRequestErrorCode.MALFORMED_VALUE;
}
