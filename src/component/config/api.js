import axios from "axios";

export const API_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Những route *public* (KHÔNG gắn Authorization)
const PUBLIC_PATHS = [
  /^\/forgot-password\//,
  /^\/login\//,
  /^\/register\//,
  /^\/refresh_token\//,
  /^\/v3\/api-docs\//,
  /^\/swagger-ui\//,
  /^\/swagger-resources\//,
  /^\/webjars\//,
  /^\/api\/restaurants\//,
];

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};

  let pathname = "";
  try {
    pathname = new URL(config.url ?? "", config.baseURL).pathname;
  } catch {
    const u = config.url ?? "";
    pathname = u.startsWith("/") ? u : `/${u}`;
  }

  const isPublicOverride = config?.meta?.isPublic === true;
  const isPublicByPath = PUBLIC_PATHS.some((re) => re.test(pathname));
  const isPublic = isPublicOverride || isPublicByPath;

  const token = localStorage.getItem("access_token") || "";

  if (!isPublic && token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});
