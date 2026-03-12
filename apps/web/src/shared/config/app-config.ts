const fallbackAppName = 'Codex Internal Template';
const fallbackApiBaseUrl = 'http://localhost:3000';

export function getAppConfig() {
  return {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL?.trim() || fallbackApiBaseUrl,
    appName: import.meta.env.VITE_APP_NAME?.trim() || fallbackAppName,
  };
}
