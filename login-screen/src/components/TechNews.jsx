import React, { useState, useEffect } from 'react';
import { Search, User, Menu, Calendar, MapPin, Clock, Filter, ChevronDown, Eye, Share2, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const itemsPerPage = 12;

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

  const featuredNews = newsData.find(news => news.featured);
  const regularNews = newsData.filter(news => !news.featured);

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        {/* Top Bar */}
        <div className="bg-blue-600 text-white py-2">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {weather?.city ? `${weather.city}, ${weather.country || 'BR'}` : (location ? 'Localização detectada' : 'São Paulo, SP')}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {weather ? `${weather.temperature}°C - ${weather.description}` : '21°C - Ensolarado'}
              </span>
              {weather?.humidity && (
                <span className="flex items-center text-xs opacity-75">
                  💧 {weather.humidity}%
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Pesquisar notícias..."
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
                title={`Logado como: ${user?.name || user?.fullName || user?.username || 'Usuário'}`}
              >
                <User className="w-4 h-4 mr-2" />
                <span className="max-w-32 truncate">
                  {user?.name || user?.fullName || user?.username || 'Usuário'}
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
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={onBack} 
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Voltar
              </Button>
              <Button 
                variant="outline" 
                onClick={onProfile} 
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Perfil
              </Button>
              <Button 
                variant="outline" 
                onClick={onLogout} 
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Sair
              </Button>
            </div>
          </div>

          {/* Category Navigation */}
          <nav className="border-t border-gray-200">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-6 overflow-x-auto">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange('all')}
                  className="whitespace-nowrap"
                >
                  INÍCIO
                </Button>
                <Button
                  variant={selectedCategory === 'tech' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange('tech')}
                  className="whitespace-nowrap"
                >
                  TECNOLOGIA
                </Button>
                <Button
                  variant={selectedCategory === 'ai' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange('ai')}
                  className="whitespace-nowrap"
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
              <Button onClick={handleSearch}>
                Buscar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando notícias...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Featured News */}
        {!loading && !error && featuredNews && (
          <section className="mb-12">
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-white">
              <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {featuredNews.image ? (
                  <img 
                    src={featuredNews.image} 
                    alt={featuredNews.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="text-white text-center" style={{display: featuredNews.image ? 'none' : 'flex'}}>
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-12 h-12" />
                  </div>
                  <p className="text-lg">Imagem da Notícia</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className="bg-blue-600 hover:bg-blue-700">
                    {featuredNews.category}
                  </Badge>
                  <span className="text-sm opacity-90">{formatDate(featuredNews.date)}</span>
                </div>
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  {featuredNews.title}
                </h1>
                <p className="text-lg opacity-90 mb-6 max-w-3xl">
                  {featuredNews.summary}
                </p>
                <div className="flex items-center justify-between">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => featuredNews.url && window.open(featuredNews.url, '_blank')}
                  >
                    VEJA MAIS
                  </Button>
                  <div className="flex items-center space-x-4 text-sm opacity-90">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {featuredNews.views?.toLocaleString() || '0'}
                    </span>
                    <span>{featuredNews.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* News Grid */}
        {!loading && !error && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Últimas Notícias</h2>
              <p className="text-gray-600">{total} notícias encontradas</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularNews.map(news => (
                <Card key={news.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {news.image ? (
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="text-gray-400 text-center" style={{display: news.image ? 'none' : 'flex'}}>
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Eye className="w-8 h-8" />
                      </div>
                      <p className="text-sm">Imagem da Notícia</p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {news.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(news.date)}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {news.summary}
                    </p>
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="group-hover:bg-blue-50 group-hover:text-blue-600"
                        onClick={() => news.url && window.open(news.url, '_blank')}
                      >
                        Ler mais
                      </Button>
                      <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="sm" className="p-2">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="p-2">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                      <span>Por {news.author}</span>
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {news.views?.toLocaleString() || '0'}
                        </span>
                        <span>{news.readTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                
                {generatePageNumbers().map(pageNum => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Page Info */}
            {totalPages > 1 && (
              <div className="text-center mt-4 text-sm text-gray-600">
                Página {currentPage} de {totalPages} ({total} notícias no total)
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
<footer className="bg-gray-900 text-white py-12 mt-16">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      {/* Bloco logo */}
      <div>
        <h3 className="text-lg font-bold mb-4">TechNews</h3>
        <p className="text-gray-400 text-sm">
          Sua fonte confiável para as últimas notícias de tecnologia.
        </p>
      </div>

      {/* Categorias */}
      <div>
        <h4 className="font-semibold mb-4">Categorias</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><a href="#" className="hover:text-white">Tecnologia</a></li>
        </ul>
      </div>

      {/* Sobre */}
      <div>
        <h4 className="font-semibold mb-4">Sobre</h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
          <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
        </ul>
      </div>

      {/* Desenvolvedores */}
      <div>
        <h4 className="font-semibold mb-4">Desenvolvedores</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Luis */}
          <div>
            <h5 className="font-semibold mb-2">Luis Eduardo</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://www.linkedin.com/in/luis-michaud-552625272" target="_blank" className="hover:text-blue-400">LinkedIn</a></li>
              <li><a href="https://github.com/MichasISBACK" target="_blank" className="hover:text-blue-400">GitHub</a></li>
              <li><a href="https://www.instagram.com/luiss_michaud" target="_blank" className="hover:text-blue-400">Instagram</a></li>
            </ul>
          </div>

          {/* Amigo */}
          <div>
            <h5 className="font-semibold mb-2">Ronald</h5>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://www.linkedin.com/in/dev-ronald" target="_blank" className="hover:text-blue-400">LinkedIn</a></li>
              <li><a href="https://github.com/zzRonald" target="_blank" className="hover:text-blue-400">GitHub</a></li>
              <li><a href="https://www.instagram.com/spet.ronald" target="_blank" className="hover:text-blue-400">Instagram</a></li>
           
            </ul>
          </div>
        </div>
      </div>
    </div>

    {/* Direitos */}
    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
      <p>&copy; 2025 TechNews. Todos os direitos reservados.</p>
        
        </div>
       </div>
      </footer>
    </div>
  );
};

export default TechNews;