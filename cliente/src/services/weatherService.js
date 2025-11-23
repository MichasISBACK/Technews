import { API_ENDPOINTS } from '../config/api';

/**
 * Serviço de clima centralizado
 * Gerencia todas as chamadas de API relacionadas ao clima
 */
class WeatherService {
  /**
   * Busca dados de clima baseado em coordenadas
   */
  async getWeather(lat, lon) {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
      });

      const url = `${API_ENDPOINTS.WEATHER}?${params.toString()}`;
      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao buscar dados de clima.');
      }

      return data;
    } catch (error) {
      console.error('Erro ao buscar clima:', error);
      throw error;
    }
  }

  /**
   * Obtém a localização do usuário e busca o clima
   */
  async getCurrentLocationWeather() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada pelo navegador.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const weather = await this.getWeather(
              position.coords.latitude,
              position.coords.longitude
            );
            resolve(weather);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(new Error('Não foi possível obter sua localização.'));
        }
      );
    });
  }
}

export default new WeatherService();
