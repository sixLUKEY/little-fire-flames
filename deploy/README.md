# Little Fire Flames – Deployment

Backend (API Gateway, Lambda, Cognito) is deployed with AWS SAM. The Angular frontend is hosted on existing S3 + CloudFront and is **not** managed by this stack.

## Target architecture

| Component | Managed by | Notes |
|-----------|------------|--------|
| API Gateway + Lambda + DB | This SAM stack | REST API, Cognito auth |
| S3 + CloudFront (frontend) | Manual / existing | Not in template |
| Cognito User Pool + Client | This SAM stack | JWT → API Gateway authorizer |

Auth flow: **Angular → Cognito User Pool → JWT → API Gateway → Lambda**.

Users are created **manually in Cognito** (AWS Console) for now.

---

## Deployment process

### 1. Build the API

From the repository root:

```bash
cd deploy/cloudformation
sam build
```

Ensure your Lambda deployment package is built and uploaded to S3 before deploy (the template expects an existing zip at the bucket/key you provide).

### 2. Deploy the stack

```bash
sam deploy --guided
```

You will be prompted for:

| Parameter | Description |
|-----------|-------------|
| **LambdaCodeS3Bucket** | S3 bucket where the API deployment zip is stored |
| **LambdaCodeS3Key** | S3 key of the zip (e.g. `api.zip`) |
| **DBHost** | Database host (e.g. RDS endpoint) |
| **DBUser** | Database username |
| **DBPassword** | Database password |
| **DBName** | Database name (default: `myapp`) |
| **DBPort** | Database port (default: `5432`) |
| **ApiStageName** | API Gateway stage name (default: `prod`) |

Also set stack name (e.g. `little-fire-flames`), region, and confirm SAM CLI IAM role creation.

Subsequent deploys:

```bash
sam build
sam deploy
```

Use the generated `samconfig.toml` to avoid re-entering parameters.

---

### 3. Deploy the Angular frontend

The Angular app loads its API URL and Cognito config at **runtime** from `/config.json`. This file is generated from the SAM stack outputs — **do not hand-edit `environment.prod.ts`**.

#### Quick method (single command)

```bash
./deploy/scripts/deploy-frontend.sh <stack-name> <s3-bucket> [region]
```

This script:
1. Calls `fetch-stack-config.js` to generate `frontend/public/config.json` from stack outputs
2. Runs `ng build` (config.json is copied into the dist via `angular.json` assets)
3. Syncs the build output to S3
4. Optionally invalidates CloudFront (set `CLOUDFRONT_DIST_ID` env var)

#### Manual method (step by step)

```bash
# Generate runtime config from stack outputs
node deploy/scripts/fetch-stack-config.js <stack-name> [region]

# Build the frontend (config.json is included automatically)
cd frontend
npm run build

# Deploy to S3
aws s3 sync dist/frontend/browser/ s3://<your-bucket> --delete

# Invalidate CloudFront cache (if applicable)
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

#### Verify config.json is in the build

```bash
cat frontend/dist/frontend/browser/config.json
```

You should see real values for `apiUrl` and `cognito`, not placeholders.

---

## Retrieve stack outputs

After a successful deploy you can inspect the raw outputs:

```bash
aws cloudformation describe-stacks \
  --stack-name little-fire-flames \
  --query 'Stacks[0].Outputs'
```

These are the same values that `fetch-stack-config.js` writes to `config.json`:

- **ApiUrl** → `config.apiUrl`
- **UserPoolId** → `config.cognito.userPoolId`
- **UserPoolClientId** → `config.cognito.clientId`
- **AWS Region** → `config.cognito.region`

---

## Post-deployment verification

### 1. Lambda function deployed

```bash
aws lambda get-function --function-name little-fire-flames-api
```

Expect a response with configuration and code location.

### 2. API Gateway reachable

Get the API URL from stack outputs, then:

```bash
curl -i https://API_URL/health
```

Replace `API_URL` with the **ApiUrl** output (e.g. `https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/prod`).

**Expected:** `HTTP/1.1 200 OK` (or 2xx) and a body such as `{"status":"ok"}` if your Lambda implements `/health`.

### 3. Cognito user pool created

```bash
aws cognito-idp list-user-pools --max-results 10 --query "UserPools[?Name=='little-fire-flames-users']"
```

Expect one pool with name `little-fire-flames-users`.

### 4. Summary

| Check | Command / action |
|-------|-------------------|
| Lambda | `aws lambda get-function --function-name little-fire-flames-api` |
| API | `curl -i https://API_URL/health` → HTTP 200 |
| Cognito | AWS Console → Cognito → User pools → `little-fire-flames-users` exists |

---

## Manual user creation (Cognito)

Users are created manually in the AWS Console for now.

1. Open **AWS Console** → **Cognito** → **User pools**.
2. Select **little-fire-flames-users**.
3. Go to **Users** → **Create user**.
4. Enter:
   - **User name:** (use the user's **email**; the pool uses email as username).
   - **Temporary password:** set a password (user will use it to sign in).
5. Optionally **uncheck** "Send an email invitation" if you will share the password another way.
6. To avoid forced password change on first sign-in:
   - After creating the user, open the user → **Send email** → **Send forgot password email**, or
   - Use **Set password** (if available in your console) to set a permanent password and mark it as not temporary.

User can then sign in from the Angular app using **email** and **password**; the app receives a JWT to call the API.

---

## Angular configuration

The Angular app uses **runtime config** loaded from `/config.json` (generated by `deploy/scripts/fetch-stack-config.js`). Do **not** hand-edit `environment.prod.ts` — it contains empty fallback values only.

See **[ANGULAR-COGNITO.md](./ANGULAR-COGNITO.md)** for details on the config loading mechanism and Cognito integration.

---

## Protecting API routes with the Cognito authorizer

The template defines **CognitoAuthorizer**. Routes are public by default so login and health can work without a token.

To require a JWT for a route, add `Auth` to that event on `ApiFunction` in `template.yaml`:

```yaml
Auth:
  Authorizer: CognitoAuthorizer
```

The Angular app must send the Cognito ID token in the `Authorization` header for those routes.
