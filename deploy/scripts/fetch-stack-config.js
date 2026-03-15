#!/usr/bin/env node
/**
 * Single source of truth: SAM stack outputs.
 * Run after `sam deploy` to generate frontend/public/config.json.
 * Usage: node fetch-stack-config.js <stack-name> [region]
 *   region defaults to AWS_REGION or us-east-1.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const stackName = process.argv[2];
if (!stackName) {
  console.error('Usage: node fetch-stack-config.js <stack-name> [region]');
  process.exit(1);
}
const region = process.argv[3] || process.env.AWS_REGION || 'us-east-1';

const repoRoot = path.resolve(__dirname, '../..');
const outPath = path.join(repoRoot, 'frontend', 'public', 'config.json');

function getOutputs() {
  const cmd = `aws cloudformation describe-stacks --stack-name "${stackName}" --region "${region}" --query "Stacks[0].Outputs" --output json`;
  try {
    const out = execSync(cmd, { encoding: 'utf-8' });
    return JSON.parse(out);
  } catch (e) {
    console.error('Failed to get stack outputs. Is the stack deployed and AWS CLI configured?', e.message);
    process.exit(1);
  }
}

function findOutput(outputs, key) {
  const o = outputs.find((x) => x.OutputKey === key);
  return o ? o.OutputValue : null;
}

const outputs = getOutputs();
const apiUrl = findOutput(outputs, 'ApiUrl');
const userPoolId = findOutput(outputs, 'UserPoolId');
const userPoolClientId = findOutput(outputs, 'UserPoolClientId');

if (!apiUrl || !userPoolId || !userPoolClientId) {
  console.error('Missing stack outputs. Expected: ApiUrl, UserPoolId, UserPoolClientId.');
  process.exit(1);
}

const config = {
  apiUrl,
  cognito: {
    userPoolId,
    clientId: userPoolClientId,
    region,
  },
};

const publicDir = path.dirname(outPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(outPath, JSON.stringify(config, null, 2), 'utf-8');
console.log('Wrote', outPath);
console.log('Config:', JSON.stringify(config, null, 2));
