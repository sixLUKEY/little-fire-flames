# Testing the SAM Template

This guide explains how to test your CloudFormation/SAM template before deploying to AWS.

## Prerequisites

1. **AWS SAM CLI** - Install from [AWS Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
   ```bash
   # Verify installation
   sam --version
   ```

2. **Docker** - Required for local testing (SAM uses Docker to simulate Lambda)
   ```bash
   # Verify Docker is running
   docker ps
   ```

3. **AWS CLI** (optional for local testing, required for deployment)
   ```bash
   # Verify installation
   aws --version
   ```

## Quick Test

Run the automated test script from the project root:

```bash
npm run test
# or
cd infra && ./test.sh
```

This will:
1. ✅ Validate the template syntax
2. ✅ Build the application
3. ✅ Test all API routes locally

## Manual Testing Steps

### Step 1: Validate Template Syntax

Check that your SAM template is valid:

```bash
cd infra
sam validate --template-file instance.infra.sam.yaml
```

**Expected output:**
```
instance.infra.sam.yaml is a valid SAM Template
```

### Step 2: Build the Application

**Important:** You must build the TypeScript code first, then build with SAM:

```bash
# First, build TypeScript
cd ../api
npm run build

# Then, build with SAM
cd ../infra
sam build --template-file instance.infra.sam.yaml
```

**Expected output:**
```
Building codeuri: ../api runtime: nodejs20.x metadata: {} functions: ['EventsApiFunction']
Build Succeeded
```

**Note:** The automated test script (`test.sh`) handles both builds automatically. The `samconfig.toml` file is configured to use `instance.infra.sam.yaml` as the template file.

### Step 3: Test Locally with SAM Local

#### Option A: Test Individual Routes

Test specific routes using event files:

```bash
cd infra

# Test GET /events
sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/get-events.json

# Test POST /events
sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/create-event.json

# Test GET /events/{id}
sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/get-event.json

# Test PUT /events/{id}
sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/update-event.json

# Test DELETE /events/{id}
sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/delete-event.json
```

#### Option B: Start Local API Server

Start a local API Gateway that simulates the deployed environment:

```bash
cd infra
sam local start-api --template-file instance.infra.sam.yaml --port 3001
```

Then test with curl or Postman:

```bash
# Get all events
curl http://localhost:3001/events

# Create an event
curl -X POST http://localhost:3001/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Event",
    "description": "This is a test",
    "imageUrl": "https://example.com/image.jpg"
  }'

# Get a specific event (replace {id} with actual ID from create response)
curl http://localhost:3001/events/{id}

# Update an event
curl -X PUT http://localhost:3001/events/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Event",
    "description": "Updated description"
  }'

# Delete an event
curl -X DELETE http://localhost:3001/events/{id}
```

**Note:** When testing locally, SAM will use the file-based database (`data/events.db.txt`) since `AWS_LAMBDA_FUNCTION_NAME` is not set.

### Step 4: Test with DynamoDB Local (Optional)

To test with a local DynamoDB instance:

1. Start DynamoDB Local:
   ```bash
   docker run -p 8000:8000 amazon/dynamodb-local
   ```

2. Update your test to use local DynamoDB:
   ```bash
   export AWS_ENDPOINT_URL=http://localhost:8000
   export AWS_ACCESS_KEY_ID=test
   export AWS_SECRET_ACCESS_KEY=test
   export USE_LOCAL_DB=false
   export EVENTS_TABLE_NAME=little-fire-flames-events
   ```

3. Create the table:
   ```bash
   aws dynamodb create-table \
     --endpoint-url http://localhost:8000 \
     --table-name little-fire-flames-events \
     --attribute-definitions AttributeName=id,AttributeType=S \
     --key-schema AttributeName=id,KeyType=HASH \
     --billing-mode PAY_PER_REQUEST
   ```

4. Test with SAM local:
   ```bash
   cd infra
   sam local start-api --template-file instance.infra.sam.yaml --port 3001
   ```

## Understanding Test Results

### Successful Response

A successful Lambda invocation should return:

```json
{
  "statusCode": 200,
  "headers": {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  "body": "{\"events\":[...]}"
}
```

### Common Issues

1. **"Template validation failed"**
   - Check YAML syntax
   - Verify all required properties are present
   - Check for typos in resource names

2. **"Build failed"** or **"Cannot find module 'router'"**
   - **Important:** You must build TypeScript before SAM build:
     ```bash
     cd api && npm run build
     ```
   - Ensure `api/` directory has `node_modules` installed: `cd api && npm install`
   - Check TypeScript compilation errors: `cd api && npm run build`
   - Verify `router.js` exists in `api/dist/handlers/` directory
   - Verify `tsconfig.json` is correct

3. **"Function not found"** or **"Cannot find module 'router'"**
   - Verify function name matches in template: `EventsApiFunction`
   - Check handler path: `dist/handlers/router.handler`
   - Ensure TypeScript has been built: `cd api && npm run build`
   - Verify `api/dist/handlers/router.js` exists

4. **"DynamoDB access denied"**
   - For local testing, this shouldn't happen (uses file DB)
   - For AWS testing, check IAM permissions

## Pre-Deployment Checklist

Before deploying to AWS, ensure:

- [ ] Template validates: `sam validate`
- [ ] Application builds: `sam build`
- [ ] All routes tested locally: `npm run test`
- [ ] Environment variables configured in `samconfig.toml`
- [ ] AWS credentials configured: `aws configure`
- [ ] Correct AWS region set in `samconfig.toml`

## Next Steps

Once all tests pass:

1. **Deploy to AWS:**
   ```bash
   cd infra
   sam build --template-file instance.infra.sam.yaml
   sam deploy
   ```

2. **Test deployed API:**
   ```bash
   # Get the API URL from deployment output
   curl https://your-api-url.execute-api.region.amazonaws.com/events
   ```

3. **Monitor logs:**
   ```bash
   sam logs -n EventsApiFunction --stack-name little-fire-flames --tail
   ```

## Additional Resources

- [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [Local Testing Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html)
- [Troubleshooting SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-troubleshooting.html)

