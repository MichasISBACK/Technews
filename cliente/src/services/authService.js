import { API_ENDPOINTS } from '../config/api';

/**
 * Serviço de autenticação centralizado
 * Gerencia todas as chamadas de API relacionadas à autenticação
 */
class AuthService {
  /**
   * Realiza login tradicional com username e senha
   */
  async login(username, password) {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Falha no login.');
    }

    return data;
  }

  /**
   * Realiza cadastro de novo usuário
   */
  async register(fullName, email, username, password) {
    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, username, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Falha no cadastro.');
    }

    return data;
  }

  /**
   * Autentica com Google OAuth
   */
  async googleAuth(idToken) {
    const response = await fetch(API_ENDPOINTS.GOOGLE_AUTH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Falha na autenticação com Google.');
    }

    return data;
  }

  /**
   * Inicia o fluxo de autenticação com GitHub
   */
  initiateGithubAuth() {
    window.location.href = API_ENDPOINTS.GITHUB_AUTH;
  }

  /**
   * Busca dados do usuário pelo ID
   */
  async getUserData(userId, token) {
    const response = await fetch(API_ENDPOINTS.USER(userId), {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Falha ao buscar dados do usuário.');
    }

    return data;
  }

  /**
   * Salva dados de autenticação no localStorage
   */
  saveAuthData(user, token) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('userId', user.id.toString());
  }

  /**
   * Remove dados de autenticação do localStorage
   */
  clearAuthData() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  /**
   * Recupera dados de autenticação do localStorage
   */
  getStoredAuthData() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (user && token && userId) {
      try {
        return {
          user: JSON.parse(user),
          token,
          userId
        };
      } catch (error) {
        console.error('Erro ao parsear dados de autenticação:', error);
        this.clearAuthData();
        return null;
      }
    }

    return null;
  }

  /**
   * Verifica se o token ainda é válido
   */
  isTokenValid(token) {
    if (!token) return false;

    try {
      // Decodifica o payload do JWT (sem verificar a assinatura no frontend)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Converte para milissegundos
      
      return Date.now() < expirationTime;
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return false;
    }
  }
}

export default new AuthService();
