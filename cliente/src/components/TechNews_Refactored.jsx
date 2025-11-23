
import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Clock, Filter, Eye, Heart, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const TechNewsRefactored = ({ user, onLogout, onProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const itemsPerPage = 8;

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'tech', label: 'Tecnologia' },
    { value: 'space', label: 'Espaço' },
    { value: 'cloud', label: 'Cloud Computing' },
    { value: 'ai', label: 'Inteligência Artificial' }
  ];

  const mockNews = [
    {
      id: 1,
      title: "Nova tecnologia de IA revoluciona o desenvolvimento de software",
      description: "Pesquisadores desenvolvem sistema que pode escrever código automaticamente com 95% de precisão.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop&crop=center",
      category: "ai",
      publishedAt: "2025-01-08T10:00:00Z",
      source: "TechCrunch",
      views: 1250,
      likes: 89,
      trending: true
    },
    {
      id: 2,
      title: "SpaceX lança nova missão para exploração de Marte",
      description: "A empresa de Elon Musk anuncia planos ambiciosos para colonização do planeta vermelho.",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop&crop=center",
      category: "space",
      publishedAt: "2025-01-08T08:30:00Z",
      source: "Space News",
      views: 2100,
      likes: 156,
      trending: true
    },
    {
      id: 3,
      title: "Cloud Computing atinge novo marco de crescimento",
      description: "Mercado de computação em nuvem cresce 40% no último trimestre.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop&crop=center",
      category: "cloud",
      publishedAt: "2025-01-08T07:15:00Z",
      source: "Cloud Weekly",
      views: 890,
      likes: 67
    },
    {
      id: 4,
      title: "Breakthrough em computação quântica promete revolução",
      description: "Novo processador quântico consegue resolver problemas complexos em segundos.",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop&crop=center",
      category: "tech",
      publishedAt: "2025-01-08T06:00:00Z",
      source: "Quantum Today",
      views: 1560,
      likes: 123
    },
    {
      id: 5,
      title: "Startup brasileira desenvolve chip revolucionário",
      description: "Empresa nacional cria processador que consome 80% menos energia.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop&crop=center",
      category: "tech",
      publishedAt: "2025-01-08T05:30:00Z",
      source: "Startup Brasil",
      views: 750,
      likes: 45
    },
    {
      id: 6,
      title: "Inteligência Artificial detecta doenças com precisão médica",
      description: "Sistema de IA consegue diagnosticar câncer com 99% de precisão em exames.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center",
      category: "ai",
      publishedAt: "2025-01-08T04:45:00Z",
      source: "Medical AI",
      views: 1890,
      likes: 234,
      trending: true
    },
    {
      id: 7,
      title: "Realidade Virtual transforma educação global",
      description: "Novas plataformas de VR permitem experiências educacionais imersivas.",
      image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc696?w=400&h=250&fit=crop&crop=center",
      category: "tech",
      publishedAt: "2025-01-08T03:30:00Z",
      source: "EduTech",
      views: 680,
      likes: 92
    },
    {
      id: 8,
      title: "Robôs autônomos revolucionam logística urbana",
      description: "Frota de robôs de entrega reduz tempo de entrega em 60% nas cidades.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop&crop=center",
      category: "tech",
      publishedAt: "2025-01-08T02:15:00Z",
      source: "Robotics Today",
      views: 920,
      likes: 78
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredNews = mockNews;
      
      if (selectedCategory !== 'all') {
        filteredNews = filteredNews.filter(news => news.category === selectedCategory);
      }
      
      if (searchTerm) {
        filteredNews = filteredNews.filter(news => 
          news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setNewsData(filteredNews);
      setTotal(filteredNews.length);
      setTotalPages(Math.ceil(filteredNews.length / itemsPerPage));
      setLoading(false);
    };

    loadData();
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (newsId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(newsId)) {
      newFavorites.delete(newsId);
    } else {
      newFavorites.add(newsId);
    }
    setFavorites(newFavorites);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('pt-BR', {
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

  const getCurrentPageNews = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return newsData.slice(startIndex, endIndex);
  };

  const getCategoryColor = (category) => {
    const colors = {
      'ai': 'bg-purple-100 text-purple-700 border-purple-200',
      'space': 'bg-blue-100 text-blue-700 border-blue-200',
      'cloud': 'bg-green-100 text-green-700 border-green-200',
      'tech': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'ai': 'Inteligência Artificial',
      'space': 'Espaço',
      'cloud': 'Cloud Computing',
      'tech': 'Tecnologia'
    };
    return labels[category] || 'Tecnologia';
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo e Título */}
            <div className="flex-shrink-0 text-center md:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                TechNews
              </h1>
              <p className="text-gray-600 text-sm mt-1">As últimas notícias de tecnologia</p>
            </div>

            {/* Barra de Busca e Usuário */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Pesquisar notícias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 w-full md:w-72 bg-gray-50 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  aria-label="Pesquisar notícias"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfile}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
                title={`Logado como: ${user?.fullName || user?.username || 'Usuário'}`}
                aria-label="Ver perfil do usuário"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">
                  {user?.fullName?.split(' ')[0] || user?.username || 'Usuário'}
                </span>
              </Button>
              <ThemeToggle />
            </div>
          </div>

          {/* Boas-vindas e Estatísticas */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 mt-6 text-white text-center shadow-md">
            <h2 className="text-2xl font-bold mb-2">
              Bem-vindo ao TechNews, {user?.fullName?.split(' ')[0] || user?.username || 'Usuário'}! 👋
            </h2>
            <p className="text-blue-100 text-lg">
              Fique por dentro das últimas novidades e tendências em tecnologia.
            </p>
            <div className="mt-4 text-xl font-semibold">
              <strong className="text-white">{total}</strong> notícias disponíveis
            </div>
          </div>

          {/* Navegação de Categorias e Filtros */}
          <nav className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex flex-wrap items-center gap-2 pb-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(category.value)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${selectedCategory === category.value 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                  `}
                  aria-pressed={selectedCategory === category.value}
                >
                  {category.label}
                </Button>
              ))}
              <div className="relative ml-auto md:ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  aria-haspopup="true"
                  aria-expanded={showFilterDropdown}
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </Button>
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Mais Recentes</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Mais Populares</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Mais Visualizados</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {getCurrentPageNews().map((news) => (
                <Card key={news.id} className="group flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white">
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x250/E0E7FF/4338CA?text=${getCategoryLabel(news.category)}`;
                      }}
                    />
                    
                    {/* Trending Badge */}
                    {news.trending && (
                      <Badge className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        TRENDING
                      </Badge>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(news.id)}
                      className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={favorites.has(news.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors duration-200 ${favorites.has(news.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                      />
                    </button>
                  </div>
                  
                  <CardContent className="p-5 flex flex-col flex-grow">
                    <Badge className={`inline-flex self-start mb-3 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                      {getCategoryLabel(news.category)}
                    </Badge>
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed flex-grow">
                      {news.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
                      <span className="font-medium text-gray-700">{news.source}</span>
                      <span>{formatDate(news.publishedAt)}</span>
                    </div>
                    
                    {/* Visualizações e Likes - Visíveis apenas no hover ou em menor destaque */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {news.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-3 h-3 mr-1" />
                          {news.likes}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium shadow-sm"
                      >
                        Ler mais
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index + 1}
                    variant={currentPage === index + 1 ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(index + 1)}
                    className="px-4 py-2 rounded-md"
                    aria-label={`Página ${index + 1}`}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Próxima página"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default TechNewsRefactored;

