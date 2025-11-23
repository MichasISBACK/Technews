import React, { useState, useEffect } from 'react';
import { Search, User, MapPin, Clock, Filter, Eye, Heart, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

const TechNews = ({ user, onLogout, onProfile, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [favorites, setFavorites] = useState(new Set());

  const itemsPerPage = 8; // Layout compacto original

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'tech', label: 'Tecnologia' },
    { value: 'space', label: 'Espaço' },
    { value: 'cloud', label: 'Cloud Computing' },
    { value: 'ai', label: 'Inteligência Artificial' }
  ];

  // Mock data otimizado para layout compacto
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

  // Simular carregamento de dados
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5">
          <div className="max-width-container px-6 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5" />
                São Paulo, SP
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                21°C - Ensolarado
              </span>
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
                  className="pl-10 pr-4 py-2 w-72 text-black bg-white border-none rounded-full text-sm focus:ring-2 focus:ring-white/30"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onProfile}
                className="text-white hover:bg-white/10 flex items-center px-3 py-1.5 rounded-full"
                title={`Logado como: ${user?.fullName || user?.username || 'Usuário'}`}
              >
                <User className="w-4 h-4 mr-1.5" />
                <span className="text-sm">
                  {user?.fullName?.split(' ')[0] || user?.username || 'Usuário'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-width-container px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">TechNews</h1>
              <p className="text-gray-600">Últimas notícias de tecnologia</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <strong className="text-gray-900">{total}</strong> notícias encontradas
              </div>
              <div className="flex items-center text-sm text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>Em alta</span>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <nav className="border-t border-gray-100 pt-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange(category.value)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategory === category.value 
                      ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                      : 'hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
                >
                  {category.label}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 px-4 py-2 rounded-full border-gray-300 hover:bg-gray-50 ml-4"
              >
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-width-container px-6 py-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Bem-vindo ao TechNews, {user?.fullName?.split(' ')[0] || user?.username || 'Usuário'}! 👋
              </h2>
              <p className="text-blue-100">
                Fique por dentro das últimas novidades e tendências em tecnologia
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{total}</div>
              <div className="text-blue-100 text-sm">notícias disponíveis</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* News Grid - Layout Compacto Original */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {getCurrentPageNews().map((news) => (
                <Card key={news.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 rounded-xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x250/F3F4F6/6B7280?text=${getCategoryLabel(news.category)}`;
                      }}
                    />
                    
                    {/* Trending Badge */}
                    {news.trending && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        TRENDING
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(news.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200"
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors duration-200 ${
                          favorites.has(news.id) ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
                        }`}
                      />
                    </button>
                    
                    {/* Category Badge */}
                    <Badge className={`absolute bottom-3 left-3 ${getCategoryColor(news.category)} px-2 py-1 rounded-full text-xs border`}>
                      {getCategoryLabel(news.category)}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {news.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="font-medium text-gray-700">{news.source}</span>
                      <span>{formatDate(news.publishedAt)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium"
                      >
                        Ler mais
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </Button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg ${
                        currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border-gray-300 hover:bg-gray-50"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && newsData.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma notícia encontrada
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou termos de busca
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12">
        <div className="max-width-container px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-bold mb-3 text-gray-900">TechNews</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sua fonte confiável para as últimas notícias e tendências em tecnologia. 
                Mantemos você sempre atualizado com o que há de mais importante no mundo tech.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Categorias</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Inteligência Artificial</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Cloud Computing</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Startups</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Cibersegurança</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Sobre</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Nossa equipe</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Contato</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Política de Privacidade</li>
                <li className="hover:text-blue-600 cursor-pointer transition-colors">Termos de Uso</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gray-900">Newsletter</h4>
              <p className="text-gray-600 text-sm mb-3">
                Receba as principais notícias diretamente no seu email.
              </p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Seu email"
                  className="rounded-l-lg border-gray-300 flex-1 text-sm"
                />
                <Button className="rounded-r-lg bg-blue-600 hover:bg-blue-700 px-4 text-sm">
                  Inscrever-se
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 text-center text-gray-500 text-sm">
            <p>© 2025 TechNews. Todos os direitos reservados. Feito com ❤️ para a comunidade tech.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TechNews;
