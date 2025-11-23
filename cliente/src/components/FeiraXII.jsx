import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Send, 
  MapPin, 
  Calendar, 
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Camera,
  Edit3,
  Save,
  Eye,
  Users
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';

const FeiraXII = ({ user, onBack }) => {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: null,
    location: '',
    category: 'geral'
  });
  const fileInputRef = useRef(null);

  // Posts mock da feira
  const mockPosts = [
    {
      id: 1,
      title: 'Projeto de Robótica Avançada',
      description: 'Desenvolvemos um robô autônomo capaz de navegar e realizar tarefas complexas usando IA.',
      author: {
        name: 'João Silva',
        avatar: 'JS',
        school: 'ETEC São Paulo'
      },
      image: null,
      category: 'Robótica',
      location: 'Pavilhão A - Stand 12',
      createdAt: '2025-01-20T10:30:00Z',
      likes: 45,
      comments: 12,
      views: 230,
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 2,
      title: 'App de Sustentabilidade Urbana',
      description: 'Aplicativo que conecta cidadãos para ações sustentáveis na cidade, com gamificação e recompensas.',
      author: {
        name: 'Maria Santos',
        avatar: 'MS',
        school: 'IFSP Campinas'
      },
      image: null,
      category: 'Sustentabilidade',
      location: 'Pavilhão B - Stand 05',
      createdAt: '2025-01-20T09:15:00Z',
      likes: 67,
      comments: 18,
      views: 340,
      isLiked: true,
      isBookmarked: false
    },
    {
      id: 3,
      title: 'Sistema de Monitoramento Agrícola',
      description: 'IoT aplicado à agricultura para monitoramento de solo, clima e otimização de irrigação.',
      author: {
        name: 'Carlos Oliveira',
        avatar: 'CO',
        school: 'ETEC Agropecuária'
      },
      image: null,
      category: 'IoT',
      location: 'Pavilhão C - Stand 08',
      createdAt: '2025-01-20T08:45:00Z',
      likes: 38,
      comments: 9,
      views: 180,
      isLiked: false,
      isBookmarked: true
    }
  ];

  useState(() => {
    setPosts(mockPosts);
  }, []);

  const categories = [
    'Geral',
    'Robótica',
    'Sustentabilidade',
    'IoT',
    'Inteligência Artificial',
    'Desenvolvimento Web',
    'Mobile',
    'Games',
    'Biotecnologia',
    'Energia Renovável'
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPost(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewPost(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.description.trim()) {
      alert('Por favor, preencha o título e a descrição');
      return;
    }

    const post = {
      id: Date.now(),
      title: newPost.title,
      description: newPost.description,
      author: {
        name: user?.fullName || user?.username || 'Usuário',
        avatar: (user?.fullName || user?.username || 'U').charAt(0).toUpperCase(),
        school: 'Sua Escola'
      },
      image: newPost.imagePreview,
      category: newPost.category,
      location: newPost.location || 'A definir',
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      views: 0,
      isLiked: false,
      isBookmarked: false
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({
      title: '',
      description: '',
      image: null,
      imagePreview: null,
      location: '',
      category: 'geral'
    });
    setShowCreatePost(false);
    
    alert('Projeto publicado com sucesso!');
  };

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const toggleBookmark = (postId) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Agora há pouco';
      if (diffInHours < 24) return `${diffInHours}h atrás`;
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  🎪 Feira XII
                  <Badge className="ml-2 bg-green-100 text-green-800">
                    {posts.length} projetos
                  </Badge>
                </h1>
                <p className="text-gray-600">Compartilhe e descubra projetos incríveis</p>
              </div>
            </div>
            
            <Button onClick={() => setShowCreatePost(true)} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </div>
        </div>
      </header>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Edit3 className="w-5 h-5 mr-2" />
                  Criar Novo Projeto
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowCreatePost(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Projeto *
                </label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Sistema de Monitoramento Inteligente"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{newPost.title.length}/100 caracteres</p>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição do Projeto *
                </label>
                <Textarea
                  value={newPost.description}
                  onChange={(e) => setNewPost(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva seu projeto, tecnologias utilizadas, objetivos e resultados..."
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{newPost.description.length}/500 caracteres</p>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  {categories.map(category => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Localização */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localização na Feira
                </label>
                <Input
                  value={newPost.location}
                  onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Ex: Pavilhão A - Stand 15"
                />
              </div>

              {/* Upload de Imagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagem do Projeto
                </label>
                
                {newPost.imagePreview ? (
                  <div className="relative">
                    <img
                      src={newPost.imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={removeImage}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  >
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Clique para adicionar uma foto</p>
                    <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
                  </div>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Botões */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmitPost} className="flex items-center">
                  <Send className="w-4 h-4 mr-2" />
                  Publicar Projeto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{posts.length}</div>
              <div className="text-sm text-gray-600">Projetos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600">
                {posts.reduce((sum, post) => sum + post.likes, 0)}
              </div>
              <div className="text-sm text-gray-600">Curtidas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {posts.reduce((sum, post) => sum + post.views, 0)}
              </div>
              <div className="text-sm text-gray-600">Visualizações</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categorias</div>
            </CardContent>
          </Card>
        </div>

        {/* Posts */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum projeto ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Seja o primeiro a compartilhar seu projeto na Feira XII!
              </p>
              <Button onClick={() => setShowCreatePost(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Post Header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {post.author.avatar}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                          <p className="text-sm text-gray-600">{post.author.school}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.createdAt)}</span>
                            <MapPin className="w-3 h-3 ml-2" />
                            <span>{post.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-6 pb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{post.description}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="px-6 pb-4">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center space-x-2 transition-colors ${
                            post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                          <span className="text-sm font-medium">{post.likes}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Compartilhar</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-xs text-gray-500">
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views}
                        </span>
                        
                        <button
                          onClick={() => toggleBookmark(post.id)}
                          className={`transition-colors ${
                            post.isBookmarked ? 'text-yellow-500' : 'text-gray-500 hover:text-yellow-500'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeiraXII;
