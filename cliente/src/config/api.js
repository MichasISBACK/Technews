// Configuração centralizada da API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_URL}/api/auth/login`,
  REGISTER: `${API_URL}/api/auth/register`,
  GOOGLE_AUTH: `${API_URL}/api/auth/google`,
  GITHUB_AUTH: `${API_URL}/api/auth/github`,
  GITHUB_CALLBACK: `${API_URL}/api/auth/github/callback`,
  
  // User endpoints
  USER: (id) => `${API_URL}/api/users/${id}`,
  
  // News endpoints
  NEWS: `${API_URL}/api/news`,
  NEWS_CATEGORIES: `${API_URL}/api/news/categories`,
  
  // Weather endpoint
  WEATHER: `${API_URL}/api/weather`,
  
  // Health check
  HEALTH: `${API_URL}/api/health`,
};

export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
};

export default API_URL;
