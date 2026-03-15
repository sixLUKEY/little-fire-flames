# Deploying Little Fire Flames to AWS

This guide walks through deploying the stack with **CloudFormation** or **SAM**: frontend on S3 + CloudFront, API on API Gateway + Lambda, and your existing Postgres (e.g. RDS) via parameters.

---

## How deployment knows which files to run

**API (Lambda)**  
The template does **not** discover your code. You decide what gets deployed by what you put in the **deployment package** (the zip) and where you point the template.

- **What runs:** Lambda runs a single **handler**: the Node entrypoint you set in the template. For this app it’s `dist/index.handler`.
  - `dist/index` = file `dist/index.js` (from `api/src/index.ts` after `npm run build`).
  - `.handler` = the exported function name in that file.
- **What goes in the zip:** You build the API (`npm run build` in `api/`), then zip the **artifacts Lambda needs at runtime**: `dist/`, `node_modules/`, and `package.json`. So the zip is built by you; the template only says “use this zip” (CloudFormation: `LambdaCodeS3Bucket` + `LambdaCodeS3Key`; SAM: `CodeUri: s3://...`).
- **Summary:** You package `api/` (dist + node_modules) → upload the zip to S3 → the template points the Lambda at that S3 object. Lambda then runs `dist/index.handler` inside that zip.

**Frontend (S3 + CloudFront)**  
The template only creates the **bucket** and the **CloudFront distribution**. It does **not** upload any files.

- **What gets served:** Whatever you upload to the frontend bucket. Typically you run `ng build --configuration=production` and then `aws s3 sync ... s3://<FrontendBucketName>/`. So the “which files” is: the contents of `frontend/dist/.../browser/` (or whatever path `ng build` outputs).
- **Summary:** You build the Angular app → you upload that build output to the bucket (e.g. with `aws s3 sync`) → CloudFront serves it. The template just defines the bucket and distribution; you control the deployed files.

---

## Prerequisites

- AWS CLI installed and configured (`aws configure`)
- Node 18+ for building API and frontend
- An existing Postgres database (e.g. Amazon RDS) reachable from Lambda (same VPC if RDS is in a VPC)

## 1. Package the API for Lambda

From the repo root. The zip must contain `dist/`, `node_modules/`, and `package.json` at the **top level** so the handler `dist/index.handler` resolves to `dist/index.js` inside the zip.

```bash
cd api
npm ci
npm run build
# Zip from inside api/ so the root of the zip has dist/, node_modules/, package.json
zip -r ../api.zip dist node_modules package.json
cd ..
```

Upload the zip to an S3 bucket (create one if needed):

```bash
aws s3 mb s3://YOUR-DEPLOY-BUCKET --region YOUR_REGION   # if new bucket
aws s3 cp api.zip s3://YOUR-DEPLOY-BUCKET/api.zip
```

## 2. Deploy the stack (CloudFormation or SAM)

**Option A – CloudFormation**  
Using the template in `deploy/cloudformation/template.yaml`:

```bash
aws cloudformation deploy \
  --template-file deploy/cloudformation/template.yaml \
  --stack-name little-fire-flames \
  --parameter-overrides \
    LambdaCodeS3Bucket=YOUR-DEPLOY-BUCKET \
    LambdaCodeS3Key=api.zip \
    DBHost=your-rds-endpoint.region.rds.amazonaws.com \
    DBUser=myapp_user \
    DBPassword=YOUR_DB_PASSWORD \
    DBName=myapp \
  --capabilities CAPABILITY_NAMED_IAM \
  --region YOUR_REGION
```

**Option B – SAM**  
Using the template in `deploy/sam/template.yaml`. Package the API and upload to S3 first (step 1), then deploy with SAM (no `sam build` for the Lambda, since the code is already in S3):

```bash
sam deploy \
  --template-file deploy/sam/template.yaml \
  --stack-name little-fire-flames \
  --parameter-overrides \
    LambdaCodeS3Bucket=YOUR-DEPLOY-BUCKET \
    LambdaCodeS3Key=api.zip \
    DBHost=your-rds-endpoint.region.rds.amazonaws.com \
    DBUser=myapp_user \
    DBPassword=YOUR_DB_PASSWORD \
    DBName=myapp \
  --capabilities CAPABILITY_NAMED_IAM \
  --no-execute-changeset \
  --region YOUR_REGION
# Review the changeset, then:
aws cloudformation execute-change-set --change-set-name <ChangeSetName>
# Or run without --no-execute-changeset to deploy in one step.
```

If your database is in a VPC, ensure the Lambda function is in the same VPC (add subnet and security group parameters to the template and set them on the Lambda). The template above does not configure VPC; add `VpcConfig` to `ApiFunction` and a security group that allows outbound to the RDS port if required.

## 3. Get the API URL

After the stack completes:

```bash
aws cloudformation describe-stacks \
  --stack-name little-fire-flames \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text
```

Use this value (e.g. `https://xxxxxxxx.execute-api.region.amazonaws.com/prod`) as the production API base URL for the frontend.

## 4. Build the frontend with the API URL

Set the production API URL and build:

1. Edit `frontend/src/environments/environment.prod.ts` and set `apiUrl` to the value from step 3 (e.g. `https://xxxxxxxx.execute-api.region.amazonaws.com/prod`), **or**
2. Use a build-time replacement (e.g. in CI):
   ```bash
   export API_URL="https://xxxxxxxx.execute-api.region.amazonaws.com/prod"
   sed -i '' "s|REPLACE_WITH_API_GATEWAY_URL|$API_URL|g" frontend/src/environments/environment.prod.ts
   ```

Then build:

```bash
cd frontend
npm ci
npm run build -- --configuration=production
```

The output is in `frontend/dist/frontend/browser/` (or the path shown by `ng build`).

## 5. Upload the frontend to S3

Get the frontend bucket name from the stack outputs, then sync the build output:

```bash
BUCKET=$(aws cloudformation describe-stacks --stack-name little-fire-flames \
  --query 'Stacks[0].Outputs[?OutputKey==`FrontendBucketName`].OutputValue' --output text)
aws s3 sync frontend/dist/frontend/browser/ s3://$BUCKET/ --delete
```

Invalidate the CloudFront cache so changes are visible immediately:

```bash
DIST_ID=$(aws cloudformation describe-stacks --stack-name little-fire-flames \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' --output text)
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

## 6. Entrypoints summary

| What            | URL / usage |
|-----------------|-------------|
| **Frontend**    | CloudFront URL from output `FrontendUrl` (e.g. `https://xxxxx.cloudfront.net`) |
| **API**         | API Gateway URL from output `ApiUrl`; frontend `apiUrl` must match this |
| **API routes**  | Same as local: `/v1/auth/login`, `/v1/learners`, etc. (path is passed through by proxy) |

Ensure the Lambda can reach your database (same VPC and security group if RDS is in a VPC). If you use RDS in the same account, add VPC config to the Lambda and a security group that allows outbound to the RDS port.

## Updating the deployment

- **API**: Rebuild the zip, upload to S3 with the same key (or a new key and pass `LambdaCodeS3Key`), then run `aws cloudformation deploy` again or update the Lambda code via the console/CLI.
- **Frontend**: Rebuild with the same `apiUrl`, then `aws s3 sync` and create a CloudFront invalidation for `/*`.
- **Stack changes**: Edit `deploy/cloudformation/template.yaml` and run `aws cloudformation deploy` with the same stack name and any new parameters.
