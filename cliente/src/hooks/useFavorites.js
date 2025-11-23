import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

/**
 * Hook customizado para gerenciar favoritos
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Carrega favoritos do localStorage ao montar
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, []);

  // Salva favoritos no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [favorites]);

  /**
   * Adiciona um item aos favoritos
   */
  const addFavorite = (item) => {
    setFavorites((prev) => {
      // Verifica se já existe (baseado na URL)
      const exists = prev.some((fav) => fav.url === item.url);
      if (exists) return prev;

      return [...prev, { ...item, favoritedAt: new Date().toISOString() }];
    });
  };

  /**
   * Remove um item dos favoritos
   */
  const removeFavorite = (url) => {
    setFavorites((prev) => prev.filter((fav) => fav.url !== url));
  };

  /**
   * Verifica se um item está nos favoritos
   */
  const isFavorite = (url) => {
    return favorites.some((fav) => fav.url === url);
  };

  /**
   * Alterna o estado de favorito de um item
   */
  const toggleFavorite = (item) => {
    if (isFavorite(item.url)) {
      removeFavorite(item.url);
    } else {
      addFavorite(item);
    }
  };

  /**
   * Limpa todos os favoritos
   */
  const clearFavorites = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites,
  };
}
