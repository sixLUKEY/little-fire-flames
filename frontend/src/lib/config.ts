// API Configuration
// In local development, use the local API server
// In production, use the deployed AWS API Gateway URL

const isLocal = import.meta.env.DEV || import.meta.env.VITE_USE_LOCAL_API === "true";
const localApiUrl = import.meta.env.VITE_LOCAL_API_URL || "http://localhost:3001";
const productionApiUrl = import.meta.env.VITE_API_URL || "";

export const API_BASE_URL = isLocal ? localApiUrl : productionApiUrl;

export const USE_LOCAL_MODE = isLocal;

