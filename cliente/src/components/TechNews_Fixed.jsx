import React, { useState, useEffect } from 'react';
import { Search, User, Menu, Calendar, MapPin, Clock, Filter, ChevronDown, Eye, Share2, Bookmark, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const TechNews = ({ user, onLogout, onProfile, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const itemsPerPage = 13; // 13 notícias na primeira página

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'tech', label: 'Tecnologia' },
    { value: 'space', label: 'Espaço' },
    { value: 'cloud', label: 'Cloud Computing' },
    { value: 'ai', label: 'Inteligência Artificial' }
  ];

  const dateFilters = [
    { value: 'all', label: 'Todas as Datas' },
    { value: 'today', label: 'Hoje' },
    { value: 'week', label: 'Esta Semana' },
    { value: 'month', label: 'Este Mês' }
  ];

  // Função para buscar notícias da API
  const fetchNews = async (page = 1, category = selectedCategory, search = searchTerm, date = selectedDate) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        category: category,
        date: date
      });
      
      if (search.trim()) {
        params.append('search', search.trim());
      }

      const response = await fetch(`http://localhost:8000/api/news?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar notícias');
      }
      
      const data = await response.json();
      
      setNewsData(data.news || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setCurrentPage(page);
      
    } catch (err) {
      console.error('Erro ao buscar notícias:', err);
      setError(err.message);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar clima baseado na localização
  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await fetch(`http://localhost:8000/api/weather?lat=${latitude}&lon=${longitude}`);
      if (response.ok) {
        const weatherData = await response.json();
        setWeather(weatherData);
      }
    } catch (err) {
      console.error('Erro ao buscar clima:', err);
    }
  };

  // Função para obter localização do usuário
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setLocationError('Não foi possível obter sua localização');
        }
      );
    } else {
      setLocationError('Geolocalização não é suportada pelo seu navegador');
    }
  };

  // Função para adicionar/remover favoritos
  const toggleFavorite = (newsId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(newsId)) {
        newFavorites.delete(newsId);
      } else {
        newFavorites.add(newsId);
      }
      // Salvar no localStorage
      localStorage.setItem('techNewsFavorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
  };

  // Efeito para carregar favoritos do localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('techNewsFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Efeito para carregar notícias iniciais
  useEffect(() => {
    fetchNews(1);
  }, []);

  // Efeito para solicitar localização (opcional)
  useEffect(() => {
    const hasAskedLocation = localStorage.getItem('hasAskedLocation');
    if (!hasAskedLocation) {
      const askLocation = window.confirm(
        'Deseja permitir o acesso à sua localização para mostrar informações de clima personalizadas? (Opcional)'
      );
      if (askLocation) {
        getUserLocation();
      }
      localStorage.setItem('hasAskedLocation', 'true');
    }
  }, []);

  // Função para lidar com mudança de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchNews(newPage);
    }
  };

  // Função para lidar com busca
  const handleSearch = () => {
    setCurrentPage(1);
    fetchNews(1, selectedCategory, searchTerm, selectedDate);
  };

  // Função para lidar com mudança de categoria
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    fetchNews(1, category, searchTerm, selectedDate);
  };

  // Função para lidar com mudança de filtro de data
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setCurrentPage(1);
    fetchNews(1, selectedCategory, searchTerm, date);
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDate('all');
    setSearchTerm('');
    setCurrentPage(1);
    fetchNews(1, 'all', '', 'all');
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Função para gerar páginas de paginação
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        {/* Top Bar */}
        <div className="bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {weather?.city ? `${weather.city}, BR` : (location ? 'Buscando...' : 'São Paulo, SP')}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {weather ? `${weather.temperature}°C - ${weather.description}` : '21°C - Ensolarado'}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-1 w-64 text-black bg-white border-none rounded-md text-sm"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfile}
                className="text-white hover:bg-blue-700 flex items-center"
                title={`Logado como: ${user?.fullName || user?.username || 'Usuário'}`}
              >
                <User className="w-4 h-4 mr-2" />
                <span className="max-w-32 truncate">
                  {user?.fullName?.split(' ')[0] || user?.username}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-blue-600">TechNews</h1>
              <p className="text-gray-600 text-sm">Últimas notícias de tecnologia</p>
            </div>
          </div>

          {/* Category Navigation */}
          <nav className="border-t border-gray-200">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-6 overflow-x-auto">
                <Button
                  variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange('all')}
                  className="whitespace-nowrap"
                >
                  INÍCIO
                </Button>
                <Button
                  variant={selectedCategory === 'tech' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange('tech')}
                  className="whitespace-nowrap"
                >
                  TECNOLOGIA
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="whitespace-nowrap flex items-center"
                >      
                  <Filter className="w-4 h-4 mr-2" />
                  Filtros
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDate} onValueChange={handleDateChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Data" />
                </SelectTrigger>
                <SelectContent>
                  {dateFilters.map(filter => (
                    <SelectItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
            <h1 className="text-4xl font-bold mb-4">Bem-vindo ao TechNews</h1>
            <p className="text-xl opacity-90 mb-6">Fique por dentro das últimas novidades em tecnologia</p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-sm opacity-90">Notícias</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Atualizações</div>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm opacity-90">Gratuito</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Coluna Principal (Notícias) */}
          <div className="lg:col-span-2">
            <section className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Últimas Notícias</h2>
                <p className="text-gray-600">{total} notícias encontradas</p>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando notícias...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar notícias</h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <Button onClick={() => fetchNews(1)}>Tentar Novamente</Button>
                </div>
              )}

              {!loading && !error && newsData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {newsData.map(news => {
                    const isFavorited = favorites.has(news.id);
                    return (
                      <Card key={news.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                        <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                          {news.image ? (
                            <img 
                              src={news.image} 
                              alt={news.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <Eye className="w-8 h-8 mx-auto mb-2" />
                              <p className="text-sm">Imagem Indisponível</p>
                            </div>
                          )}
                          {/* Ícone de favorito independente */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(news.id)}
                            className={`absolute top-2 right-2 w-8 h-8 rounded-full ${
                              isFavorited 
                                ? 'bg-red-500 text-white hover:bg-red-600' 
                                : 'bg-white/80 text-gray-600 hover:bg-white'
                            }`}
                          >
                            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                          </Button>
                        </div>
                        <CardContent className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs font-medium">{news.category}</Badge>
                            <span className="text-gray-500 text-xs">{formatDate(news.date)}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                            {news.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {news.summary}
                          </p>
                          
                          {/* Nome do autor */}
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <User className="w-4 h-4 mr-1" />
                            <span>{news.author || 'Redação TechNews'}</span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                              Ler mais <ChevronRight className="w-4 h-4 ml-1" />
                            </a>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {!loading && !error && newsData.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma notícia encontrada</h3>
                  <p className="text-gray-600">Tente ajustar seus filtros ou termos de busca.</p>
                </div>
              )}

              {/* Paginação */}
              {!loading && !error && newsData.length > 0 && totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {generatePageNumbers().map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </section>
          </div>

          {/* Coluna Lateral (Sobre, Categorias, Newsletter) */}
          <div className="lg:col-span-1 space-y-8">
            <section className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre o TechNews</h2>
              <p className="text-gray-700 mb-4">
                O TechNews é sua fonte confiável para as últimas notícias e tendências em tecnologia. Cobrimos desde
                startups inovadoras até grandes corporações, mantendo você sempre atualizado com o que há de mais
                importante no mundo tech.
              </p>
              <p className="text-gray-700 mb-6">
                Nossa equipe de jornalistas especializados trabalha 24/7 para trazer as notícias mais relevantes, análises
                aprofundadas e insights exclusivos do setor tecnológico.
              </p>
              <div className="flex space-x-4">
                <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center flex-1">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm">Artigos por mês</div>
                </div>
                <div className="bg-green-50 text-green-700 rounded-lg p-4 text-center flex-1">
                  <div className="text-2xl font-bold">50k+</div>
                  <div className="text-sm">Leitores ativos</div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Categorias Populares</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Inteligência Artificial</span>
                  <Badge variant="secondary">120 artigos</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Cloud Computing</span>
                  <Badge variant="secondary">85 artigos</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Startups</span>
                  <Badge variant="secondary">95 artigos</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Cibersegurança</span>
                  <Badge variant="secondary">67 artigos</Badge>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Newsletter</h2>
              <p className="text-gray-700 mb-4">Receba as principais notícias diretamente no seu email.</p>
              <form className="space-y-4">
                <Input type="email" placeholder="Seu email" className="w-full" />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">Inscrever-se</Button>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TechNews;

