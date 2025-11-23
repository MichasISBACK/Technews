import { API_ENDPOINTS } from '../config/api';

/**
 * Serviço de notícias centralizado
 * Gerencia todas as chamadas de API relacionadas a notícias
 */
class NewsService {
  /**
   * Busca notícias com filtros opcionais
   */
  async getNews(search = '', limit = 13) {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (limit) params.append('limit', limit.toString());

      const url = `${API_ENDPOINTS.NEWS}?${params.toString()}`;
      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao buscar notícias.');
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
      throw error;
    }
  }

  /**
   * Busca categorias de notícias disponíveis
   */
  async getCategories() {
    try {
      const response = await fetch(API_ENDPOINTS.NEWS_CATEGORIES);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao buscar categorias.');
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      throw error;
    }
  }

  /**
   * Busca notícias por categoria
   */
  async getNewsByCategory(categoryId, limit = 13) {
    const categoryQueries = {
      'all': '',
      'tech': 'tecnologia',
      'ai': 'inteligência artificial',
      'space': 'espaço',
    };

    const query = categoryQueries[categoryId] || '';
    return this.getNews(query, limit);
  }
}

export default new NewsService();
