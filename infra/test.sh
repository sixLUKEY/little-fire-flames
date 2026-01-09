#!/bin/bash

# Test script for SAM template validation and local testing
# This script helps validate the CloudFormation template before deployment

set -e

echo "🧪 Testing SAM Template"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo -e "${RED}❌ SAM CLI is not installed${NC}"
    echo "Install it from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

echo -e "${GREEN}✅ SAM CLI found${NC}"
echo ""

# Step 1: Validate template syntax
echo -e "${YELLOW}Step 1: Validating template syntax...${NC}"
if sam validate --template-file instance.infra.sam.yaml; then
    echo -e "${GREEN}✅ Template syntax is valid${NC}"
else
    echo -e "${RED}❌ Template validation failed${NC}"
    exit 1
fi
echo ""

# Step 2: Build the application
echo -e "${YELLOW}Step 2: Building the application...${NC}"

# First, build the TypeScript code
echo "Building TypeScript..."
cd ../api
if npm run build > /tmp/ts-build.log 2>&1; then
    echo -e "${GREEN}✅ TypeScript build successful${NC}"
    # Verify router.js was created
    if [ ! -f "dist/handlers/router.js" ]; then
        echo -e "${RED}❌ router.js not found in dist/handlers/${NC}"
        echo "Build log:"
        cat /tmp/ts-build.log
        exit 1
    fi
else
    echo -e "${RED}❌ TypeScript build failed${NC}"
    cat /tmp/ts-build.log
    exit 1
fi
cd ../infra

# Then, build with SAM
if sam build --template-file instance.infra.sam.yaml; then
    echo -e "${GREEN}✅ SAM build successful${NC}"
else
    echo -e "${RED}❌ SAM build failed${NC}"
    exit 1
fi
echo ""

# Step 3: Test individual routes locally
echo -e "${YELLOW}Step 3: Testing Lambda function locally...${NC}"
echo ""

# Test GET /events
echo "Testing GET /events..."
if SAM_LOCAL=true sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/get-events.json > /tmp/sam-test-get-events.json 2>&1; then
    echo -e "${GREEN}✅ GET /events test passed${NC}"
    echo "Response:"
    cat /tmp/sam-test-get-events.json | tail -20
else
    echo -e "${RED}❌ GET /events test failed${NC}"
    cat /tmp/sam-test-get-events.json
    exit 1
fi
echo ""

# Test POST /events
echo "Testing POST /events..."
if SAM_LOCAL=true sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/create-event.json > /tmp/sam-test-create-events.json 2>&1; then
    echo -e "${GREEN}✅ POST /events test passed${NC}"
    echo "Response:"
    cat /tmp/sam-test-create-events.json | tail -20
else
    echo -e "${RED}❌ POST /events test failed${NC}"
    cat /tmp/sam-test-create-events.json
    exit 1
fi
echo ""

# Test GET /events/{id}
echo "Testing GET /events/{id}..."
if SAM_LOCAL=true sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/get-event.json > /tmp/sam-test-get-event.json 2>&1; then
    echo -e "${GREEN}✅ GET /events/{id} test passed${NC}"
    echo "Response:"
    cat /tmp/sam-test-get-event.json | tail -20
else
    echo -e "${RED}❌ GET /events/{id} test failed${NC}"
    cat /tmp/sam-test-get-event.json
    exit 1
fi
echo ""

# Test PUT /events/{id}
echo "Testing PUT /events/{id}..."
if SAM_LOCAL=true sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/update-event.json > /tmp/sam-test-update-event.json 2>&1; then
    echo -e "${GREEN}✅ PUT /events/{id} test passed${NC}"
    echo "Response:"
    cat /tmp/sam-test-update-event.json | tail -20
else
    echo -e "${RED}❌ PUT /events/{id} test failed${NC}"
    cat /tmp/sam-test-update-event.json
    exit 1
fi
echo ""

# Test DELETE /events/{id}
echo "Testing DELETE /events/{id}..."
if SAM_LOCAL=true sam local invoke EventsApiFunction --template-file instance.infra.sam.yaml --event test-events/delete-event.json > /tmp/sam-test-delete-event.json 2>&1; then
    echo -e "${GREEN}✅ DELETE /events/{id} test passed${NC}"
    echo "Response:"
    cat /tmp/sam-test-delete-event.json | tail -20
else
    echo -e "${RED}❌ DELETE /events/{id} test failed${NC}"
    cat /tmp/sam-test-delete-event.json
    exit 1
fi
echo ""

echo -e "${GREEN}🎉 All tests passed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Review the test outputs above"
echo "  2. If everything looks good, deploy with: sam deploy"
echo ""

