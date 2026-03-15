/**
 * Runtime config loaded from /config.json in production (generated from SAM stack outputs).
 * Single source of truth: deploy/scripts/fetch-stack-config.js after sam deploy.
 */
export interface AppConfig {
  apiUrl: string;
  cognito: {
    userPoolId: string;
    clientId: string;
    region: string;
  };
}
