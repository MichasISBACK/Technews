import React, { useState, useEffect } from 'react';
import { Search, User, Menu, Calendar, MapPin, Clock, Filter, ChevronDown, Eye, Share2, Bookmark, ChevronLeft, ChevronRight, Star, ArrowLeft, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const NewsPage = ({ user, onLogout, onProfile, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(4); // Fixo em 4 páginas conforme requisito
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  // Função para calcular itens por página baseado na página atual
  const getItemsPerPage = (page) => (page === 1 ? 13 : 30);

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
      const itemsPerPage = getItemsPerPage(page);
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

  // Função para lidar com mudança de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchNews(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
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
                São Paulo, SP
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                21°C - Ensolarado
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
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-2xl font-bold text-blue-600">Todas as Notícias</h1>
              <p className="text-gray-600 text-sm">Explore todas as notícias de tecnologia</p>
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
                  TODAS
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
                  variant={selectedCategory === 'space' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange('space')}
                  className="whitespace-nowrap"
                >
                  ESPAÇO
                </Button>
                <Button
                  variant={selectedCategory === 'cloud' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange('cloud')}
                  className="whitespace-nowrap"
                >
                  CLOUD
                </Button>
                <Button
                  variant={selectedCategory === 'ai' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange('ai')}
                  className="whitespace-nowrap"
                >
                  IA
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
        {/* Stats Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Central de Notícias</h2>
                <p className="text-blue-100">Todas as notícias de tecnologia em um só lugar</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{total}</div>
                  <div className="text-sm opacity-90">Notícias</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{totalPages}</div>
                  <div className="text-sm opacity-90">Páginas</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'Todas as Notícias' : categories.find(c => c.value === selectedCategory)?.label}
            </h2>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Página {currentPage} de {totalPages}</p>
              <p className="text-gray-600">{getItemsPerPage(currentPage)} notícias por página</p>
            </div>
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                        <h3 className="font-bold text-lg mb-2 flex-1 group-hover:text-blue-600 transition-colors">{news.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{news.description}</p>
                        
                        {/* Nome do autor */}
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-4 h-4 mr-1" />
                            <span>{news.author || 'Redação TechNews'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                              <Share2 className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                              Ler mais
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {generatePageNumbers().map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 ${
                      currentPage === page 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Informações da paginação */}
              <div className="text-center mt-4 text-sm text-gray-600">
                Exibindo {getItemsPerPage(currentPage)} notícias na página {currentPage} de {totalPages}
              </div>
            </>
          )}

          {!loading && !error && newsData.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma notícia encontrada</h3>
              <p className="text-gray-600 mb-6">Tente ajustar os filtros ou termos de busca</p>
              <Button onClick={clearFilters}>Limpar Filtros</Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default NewsPage;

