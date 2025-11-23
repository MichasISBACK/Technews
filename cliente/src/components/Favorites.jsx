import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Search, 
  Filter, 
  Eye, 
  Clock, 
  Share2, 
  Bookmark,
  Calendar,
  Tag,
  Trash2,
  Download,
  Grid,
  List
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Favorites = ({ user, onBack }) => {
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  // Dados mock de favoritos
  const mockFavorites = [
    {
      id: 1,
      title: 'OpenAI lança GPT-5 com capacidades revolucionárias',
      summary: 'A nova versão promete ser um marco na inteligência artificial, com melhorias significativas em raciocínio e criatividade.',
      category: 'Inteligência Artificial',
      date: '2025-01-20T10:30:00Z',
      readTime: '5 min',
      views: 15420,
      url: 'https://example.com/news/1',
      image: null,
      savedAt: '2025-01-20T11:00:00Z',
      tags: ['IA', 'OpenAI', 'GPT-5']
    },
    {
      id: 2,
      title: 'Google anuncia nova arquitetura de processadores quânticos',
      summary: 'Breakthrough em computação quântica pode revolucionar a forma como processamos informações complexas.',
      category: 'Computação Quântica',
      date: '2025-01-19T14:15:00Z',
      readTime: '7 min',
      views: 8930,
      url: 'https://example.com/news/2',
      image: null,
      savedAt: '2025-01-19T15:30:00Z',
      tags: ['Google', 'Quântica', 'Processadores']
    },
    {
      id: 3,
      title: 'Meta apresenta novo headset de realidade virtual',
      summary: 'O dispositivo promete experiências mais imersivas com resolução 8K e tracking de movimento aprimorado.',
      category: 'Realidade Virtual',
      date: '2025-01-18T09:45:00Z',
      readTime: '4 min',
      views: 12750,
      url: 'https://example.com/news/3',
      image: null,
      savedAt: '2025-01-18T16:20:00Z',
      tags: ['Meta', 'VR', 'Headset']
    },
    {
      id: 4,
      title: 'Tesla revela avanços em condução autônoma',
      summary: 'Novos algoritmos de IA prometem tornar os veículos Tesla ainda mais seguros e eficientes.',
      category: 'Veículos Autônomos',
      date: '2025-01-17T16:20:00Z',
      readTime: '6 min',
      views: 9840,
      url: 'https://example.com/news/4',
      image: null,
      savedAt: '2025-01-17T18:45:00Z',
      tags: ['Tesla', 'Autônomo', 'IA']
    },
    {
      id: 5,
      title: 'Microsoft integra IA em todas as ferramentas do Office',
      summary: 'A integração promete aumentar a produtividade dos usuários com assistentes inteligentes.',
      category: 'Produtividade',
      date: '2025-01-16T11:30:00Z',
      readTime: '5 min',
      views: 18200,
      url: 'https://example.com/news/5',
      image: null,
      savedAt: '2025-01-16T13:15:00Z',
      tags: ['Microsoft', 'Office', 'IA']
    }
  ];

  useEffect(() => {
    // Simular carregamento dos favoritos
    setTimeout(() => {
      setFavorites(mockFavorites);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatSavedDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Há poucos minutos';
      if (diffInHours < 24) return `Há ${diffInHours} horas`;
      if (diffInHours < 48) return 'Ontem';
      return `Há ${Math.floor(diffInHours / 24)} dias`;
    } catch {
      return dateString;
    }
  };

  const removeFavorite = (id) => {
    setFavorites(prev => prev.filter(fav => fav.id !== id));
  };

  const exportFavorites = () => {
    const dataStr = JSON.stringify(favorites, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'favoritos-technews.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredAndSortedFavorites = favorites
    .filter(fav => {
      const matchesSearch = fav.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fav.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fav.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterBy === 'all') return matchesSearch;
      return matchesSearch && fav.category === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date) - new Date(a.date);
        case 'saved':
          return new Date(b.savedAt) - new Date(a.savedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'views':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  const categories = [...new Set(favorites.map(fav => fav.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Star className="w-6 h-6 mr-2 text-yellow-500" />
                  Favoritos
                  <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                    {favorites.length}
                  </Badge>
                </h1>
                <p className="text-gray-600">Suas notícias salvas para ler mais tarde</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={exportFavorites} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar nos favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Data da notícia</SelectItem>
                <SelectItem value="saved">Data que salvou</SelectItem>
                <SelectItem value="title">Título</SelectItem>
                <SelectItem value="views">Visualizações</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredAndSortedFavorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm || filterBy !== 'all' ? 'Nenhum favorito encontrado' : 'Nenhum favorito ainda'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterBy !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece a favoritar notícias clicando na estrela ao lado de cada artigo.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredAndSortedFavorites.map((favorite) => (
              <Card 
                key={favorite.id} 
                className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  viewMode === 'list' ? 'flex' : 'flex flex-col'
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      {favorite.image ? (
                        <img 
                          src={favorite.image} 
                          alt={favorite.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-white text-center">
                          <Eye className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm">Imagem Indisponível</p>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center space-x-2 mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {favorite.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(favorite.date)}</span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-3 line-clamp-2 flex-1">
                        <a href={favorite.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                          {favorite.title}
                        </a>
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                        {favorite.summary}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {favorite.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" /> 
                            {favorite.views.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> 
                            {favorite.readTime}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-2 flex items-center">
                        <Bookmark className="w-3 h-3 mr-1" />
                        Salvo {formatSavedDate(favorite.savedAt)}
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <CardContent className="p-6 flex items-start space-x-4 w-full">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {favorite.image ? (
                        <img 
                          src={favorite.image} 
                          alt={favorite.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Eye className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {favorite.category}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(favorite.date)}</span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                        <a href={favorite.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                          {favorite.title}
                        </a>
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {favorite.summary}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" /> 
                            {favorite.views.toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" /> 
                            {favorite.readTime}
                          </span>
                          <span className="flex items-center">
                            <Bookmark className="w-3 h-3 mr-1" />
                            {formatSavedDate(favorite.savedAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
