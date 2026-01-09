# Little Fire Flames

A small, AWS-native monorepo project for managing events.

## Project Structure

- `frontend/` - React + TypeScript + Vite static frontend application
- `api/` - Node.js 20 + TypeScript Lambda functions
- `infra/` - AWS SAM (CloudFormation) infrastructure definitions

## Architecture

- **API Gateway HTTP API** → **Single Lambda Function** → **DynamoDB**
- Single Lambda function handles all routes via internal routing
- DynamoDB table with pay-per-request billing (free-tier friendly)
- Simple CRUD operations for events

## Event Data Model

```typescript
{
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}
```

## Development

### Prerequisites

- Node.js 20+
- AWS CLI configured (for deployment only)
- AWS SAM CLI installed (for deployment only)

### Local Development

The project supports local development with a file-based database, separate from the frontend. **No AWS credentials are required** for local development.

#### Quick Start (Recommended)

From the project root, run:
```bash
npm run dev
```

This will start both the API server (port 3001) and frontend (port 8080) simultaneously.

Alternatively, use the shell script:
```bash
./dev.sh
```

#### Manual Start

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start the local API server:**
   ```bash
   npm run dev:api
   # or: cd api && npm run dev
   ```
   The server will run on `http://localhost:3001` and use the file-based database at `data/events.db.txt`.

3. **In a separate terminal, start the frontend:**
   ```bash
   npm run dev:frontend
   # or: cd frontend && npm run dev
   ```
   The frontend will automatically connect to the local API server in development mode.

#### Environment Configuration

- **API**: Automatically uses file-based database when not in AWS Lambda environment
  - No AWS credentials needed for local development
  - Database file: `data/events.db.txt` (gitignored, created automatically)
- **Frontend**: Automatically uses local API in development mode
  - Configured via `VITE_USE_LOCAL_API=true` in `.env.local`

### Building for Production

1. Build the TypeScript code:
   ```bash
   cd api
   npm run build
   ```
   This compiles all TypeScript files (including `router.ts`) to JavaScript in the `dist/` directory.

### Testing Before Deployment

Before deploying to AWS, test your SAM template locally:

```bash
# Run automated tests (validates template, builds, and tests all routes)
npm run test

# Or test manually:
cd infra
sam validate --template-file instance.infra.sam.yaml  # Validate syntax
sam build --template-file instance.infra.sam.yaml     # Build application
sam local start-api --template-file instance.infra.sam.yaml --port 3001  # Start local API server
```

See `infra/TESTING.md` for detailed testing instructions.

### Deployment

1. Build TypeScript and deploy with SAM:
   ```bash
   # Build TypeScript first
   cd api
   npm run build
   
   # Then build and deploy with SAM
   cd ../infra
   sam build --template-file instance.infra.sam.yaml
   sam deploy
   ```

2. The API endpoint URL will be displayed in the outputs.

### API Endpoints

- `GET /events` - List all events
- `GET /events/{id}` - Get a specific event
- `POST /events` - Create a new event
- `PUT /events/{id}` - Update an event
- `DELETE /events/{id}` - Delete an event

### Example API Request

```bash
# Create an event
curl -X POST https://your-api-url/events \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Festival",
    "description": "Join us for a fun summer celebration",
    "imageUrl": "https://example.com/image.jpg"
  }'

# Get all events
curl https://your-api-url/events
```

## Environment Variables

### API (`api/.env`)
- `USE_LOCAL_DB=true` - Use file-based database (local development)
- `LOCAL_DB_PATH` - Path to database file (default: `../../data/events.db.txt`)
- `PORT=3001` - Local server port
- `EVENTS_TABLE_NAME` - DynamoDB table name (AWS deployment)

### Frontend (`frontend/.env.local`)
- `VITE_USE_LOCAL_API=true` - Use local API server (development)
- `VITE_LOCAL_API_URL=http://localhost:3001` - Local API URL
- `VITE_API_URL` - Production API Gateway URL (deployment)

## Notes

- **Local Development**: 
  - Uses file-based database (`data/events.db.txt`) - gitignored
  - **No AWS credentials required** - DynamoDB client is not initialized
  - Automatically detects local mode (not in AWS Lambda environment)
- **AWS Deployment**: 
  - Uses DynamoDB with pay-per-request billing (free-tier friendly)
  - DynamoDB uses pay-per-request billing (no provisioned capacity needed)
  - Automatically detects AWS Lambda environment
- CORS is enabled for all origins (adjust in production)
- All Lambda functions use Node.js 20.x runtime
