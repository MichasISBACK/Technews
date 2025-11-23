/**
 * Constantes do projeto Tech News
 */

// Configurações de autenticação
export const AUTH_CONFIG = {
  TOKEN_KEY: 'token',
  USER_KEY: 'user',
  USER_ID_KEY: 'userId',
  TOKEN_EXPIRY_DAYS: 7,
};

// Configurações de paginação
export const PAGINATION = {
  NEWS_PER_PAGE: 13,
  ARTICLES_PER_PAGE: 10,
  COMMENTS_PER_PAGE: 20,
};

// Categorias de notícias
export const NEWS_CATEGORIES = [
  { id: 'all', name: 'Todas', query: '' },
  { id: 'tech', name: 'Tecnologia', query: 'tecnologia' },
  { id: 'ai', name: 'I.A.', query: 'inteligência artificial' },
  { id: 'space', name: 'Espaço', query: 'espaço' },
  { id: 'software', name: 'Software', query: 'software' },
  { id: 'hardware', name: 'Hardware', query: 'hardware' },
];

// Mensagens de erro
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  SERVER_ERROR: 'Erro no servidor. Tente novamente mais tarde.',
  AUTH_ERROR: 'Erro de autenticação. Faça login novamente.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos.',
  GENERIC_ERROR: 'Ocorreu um erro. Tente novamente.',
};

// Mensagens de sucesso
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login realizado com sucesso!',
  REGISTER_SUCCESS: 'Cadastro realizado com sucesso!',
  UPDATE_SUCCESS: 'Dados atualizados com sucesso!',
  DELETE_SUCCESS: 'Removido com sucesso!',
};

// Rotas da aplicação
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/perfil',
  SETTINGS: '/configuracoes',
  NOTIFICATIONS: '/notificacoes',
  FAVORITES: '/favoritos',
  AUTH_CALLBACK: '/auth/callback',
};

// Temas
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Limites de validação
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 20,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
};

// Timeouts e intervalos (em milissegundos)
export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 segundos
  DEBOUNCE_SEARCH: 500, // 500ms
  AUTO_SAVE: 2000, // 2 segundos
  NOTIFICATION_DURATION: 5000, // 5 segundos
};

// Configurações de localStorage
export const STORAGE_KEYS = {
  THEME: 'theme',
  LANGUAGE: 'language',
  FAVORITES: 'favorites',
  RECENT_SEARCHES: 'recent_searches',
  PREFERENCES: 'preferences',
};
