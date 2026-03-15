#!/usr/bin/env bash
set -euo pipefail

# Deploy the Angular frontend to S3 with runtime config from the SAM stack.
#
# Usage:
#   ./deploy-frontend.sh <stack-name> <s3-bucket> [region]
#
# Prerequisites:
#   - AWS CLI configured with appropriate credentials
#   - Node.js installed
#   - SAM stack already deployed
#
# Optional env vars:
#   AWS_REGION          — defaults to us-east-1
#   CLOUDFRONT_DIST_ID  — if set, creates a CloudFront invalidation after deploy

STACK_NAME="${1:?Usage: deploy-frontend.sh <stack-name> <s3-bucket> [region]}"
S3_BUCKET="${2:?Usage: deploy-frontend.sh <stack-name> <s3-bucket> [region]}"
REGION="${3:-${AWS_REGION:-us-east-1}}"

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FRONTEND_DIR="$REPO_ROOT/frontend"
SCRIPT_DIR="$(dirname "$0")"

echo "==> Generating config.json from stack '$STACK_NAME' (region: $REGION)..."
node "$SCRIPT_DIR/fetch-stack-config.js" "$STACK_NAME" "$REGION"

if [ ! -f "$FRONTEND_DIR/public/config.json" ]; then
  echo "ERROR: config.json was not generated. Aborting."
  exit 1
fi

echo "==> Building Angular frontend..."
cd "$FRONTEND_DIR"
npm run build

DIST_DIR="$FRONTEND_DIR/dist/frontend/browser"
if [ ! -d "$DIST_DIR" ]; then
  echo "ERROR: Build output not found at $DIST_DIR"
  exit 1
fi

if [ ! -f "$DIST_DIR/config.json" ]; then
  echo "ERROR: config.json missing from build output. Something went wrong."
  exit 1
fi

echo "==> Syncing to s3://$S3_BUCKET..."
aws s3 sync "$DIST_DIR" "s3://$S3_BUCKET" --delete --region "$REGION"

if [ -n "${CLOUDFRONT_DIST_ID:-}" ]; then
  echo "==> Invalidating CloudFront distribution $CLOUDFRONT_DIST_ID..."
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DIST_ID" \
    --paths "/*" \
    --region "$REGION"
fi

echo "==> Frontend deployed successfully."
echo "    S3:     s3://$S3_BUCKET"
echo "    Config: $(cat "$FRONTEND_DIR/public/config.json")"
