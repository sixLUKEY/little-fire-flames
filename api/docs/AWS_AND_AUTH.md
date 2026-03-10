# AWS & Auth Foundations

## Architecture (target)

- **API Gateway** (REST or HTTP API) in front of the API.
- **Lambda** runs the same handler as the local Express app (`handler.ts` → `router.dispatch()`).
- **DB** (e.g. RDS Postgres) is used by the Lambda via Sequelize; ensure VPC/security groups allow Lambda → RDS.

```
  Client → API Gateway → Lambda (this API) → RDS / DB
                ↓
         Lambda Authorizer (validates token, returns IAM policy + context)
```

## Local server

- `npm run dev` runs Express (`server.ts`) on `PORT` (default 3000).
- Same route table and handlers are used; Lambda uses `router.dispatch()` so behaviour matches.

## Lambda entrypoint

- Entrypoint: `handler.handler` (in `src/handler.ts`).
- `handleRequest` builds `method`, `path`, `body`, `pathParameters` from `APIGatewayProxyEvent` and calls `dispatch()`.
- DB is initialised on first invocation (`ensureDb()`); connection is reused on warm invocations.

## API Gateway

- Configure the API to proxy to the Lambda (e.g. `{proxy+}` or explicit resources like `/v1/teachers`, `/v1/teachers/{id}`).
- Ensure path and method are passed through; `event.path` and `event.pathParameters` must match what the router expects (e.g. `/v1/teachers`, `/v1/teachers/123` with `pathParameters.id = '123'`).

## Auth (token-based)

- **Goal**: Only allow valid API requests when the user is logged in (token required).
- **Login**: `POST /v1/auth/login` with `{ "email", "password" }` returns a token. Roles are **teacher** and **principal** only; parents view results via Parents Corner by entering their child's student ID (no login).
- **Dummy users** (see `auth/loginHandler.ts`): `principal@school.com` / `principal123` (full access), `teacher@school.com` / `teacher123` (results only). Replace with Cognito or your user store in production.
- **Protected routes**: Validate `Authorization: Bearer <token>` on every request.

### Express (local)

- `auth/authMiddleware.ts` checks `Authorization: Bearer <token>` and sets `req.user` (foundation only; JWT verify is TODO).
- Register public routes first (e.g. `POST /v1/auth/login`, `GET /health`), then use `authMiddleware` for all other routes when you enable auth.

### Lambda (API Gateway)

- Use a **Lambda authorizer** (token type) on the API. It receives the token, validates it (e.g. JWT verify or Cognito), and returns an IAM policy plus **context** (e.g. `userId`, `email`).
- The main Lambda receives `event.requestContext.authorizer` with that context; you can pass it into the router/handlers later when enforcing auth (e.g. to set `options.auth` or similar).

### Types

- `auth/types.ts`: `JwtPayload`, `AuthContext`, `AuthorizerContext`, `UserRole` for request-scoped auth data.
- Login response includes `role: 'parent' | 'teacher' | 'principal'` for tiered access. Frontend uses this to show/hide routes and nav.
- Placeholder login: use `principal@example.com`, `teacher@example.com`, or `parent@example.com` (password ignored) to get the corresponding role.

### AWS Cognito (production)

- Use Cognito User Pools for sign-in; store role in a **custom attribute** (e.g. `custom:role`) or in **Cognito groups** (e.g. `Principal`, `Teacher`, `Parent`).
- After Cognito sign-in, exchange the Id token (or use it as Bearer token) with your API. Lambda authorizer should validate the Cognito JWT and pass `userId`, `email`, and `role` (from custom attribute or group) in the authorizer context.
- Backend: replace `loginHandler` with a call to Cognito (e.g. `InitiateAuth` or use Amplify/Cognito hosted UI and have frontend send the Id token to your API to register the session). Alternatively, keep a thin `POST /v1/auth/login` that accepts Cognito Id token and returns a short-lived API token that includes the role.
- Frontend: replace `ApiService.login(credentials)` with Cognito Amplify sign-in or Cognito SDK; then send the Id token to your backend if you issue your own API token, or use the Id token as the Bearer token and configure API Gateway to accept it in the Lambda authorizer.

## Env (Lambda / local)

- DB connection: same as today (e.g. `DATABASE_URL` or `PG*` vars).
- Optional: `JWT_SECRET` or JWKS URL when you implement real JWT verification.
- Frontend: point `baseUrl` at API Gateway URL (or localhost in dev).
