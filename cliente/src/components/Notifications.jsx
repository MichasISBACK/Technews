import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  X, 
  Star, 
  MessageCircle, 
  Heart, 
  Share2,
  Clock,
  Filter,
  MoreVertical,
  Trash2,
  BellDot
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const Notifications = ({ user, onBack }) => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Dados mock de notificações
  const mockNotifications = [
    {
      id: 1,
      type: 'like',
      title: 'Nova curtida',
      message: 'João Silva curtiu sua atividade no TechNews',
      time: '2 min atrás',
      read: false,
      avatar: 'JS',
      color: 'bg-red-500'
    },
    {
      id: 2,
      type: 'comment',
      title: 'Novo comentário',
      message: 'Maria Santos comentou: "Excelente artigo sobre IA!"',
      time: '15 min atrás',
      read: false,
      avatar: 'MS',
      color: 'bg-blue-500'
    },
    {
      id: 3,
      type: 'news',
      title: 'Nova notícia',
      message: 'OpenAI lança nova versão do ChatGPT com recursos avançados',
      time: '1 hora atrás',
      read: true,
      avatar: 'TN',
      color: 'bg-green-500'
    },
    {
      id: 4,
      type: 'follow',
      title: 'Novo seguidor',
      message: 'Carlos Oliveira começou a seguir você',
      time: '2 horas atrás',
      read: true,
      avatar: 'CO',
      color: 'bg-purple-500'
    },
    {
      id: 5,
      type: 'share',
      title: 'Compartilhamento',
      message: 'Ana Costa compartilhou seu artigo sobre Cloud Computing',
      time: '3 horas atrás',
      read: false,
      avatar: 'AC',
      color: 'bg-orange-500'
    },
    {
      id: 6,
      type: 'news',
      title: 'Notícia em destaque',
      message: 'Google anuncia novos recursos para desenvolvedores Android',
      time: '5 horas atrás',
      read: true,
      avatar: 'TN',
      color: 'bg-green-500'
    },
    {
      id: 7,
      type: 'system',
      title: 'Atualização do sistema',
      message: 'Nova versão do TechNews disponível com melhorias de performance',
      time: '1 dia atrás',
      read: true,
      avatar: 'SY',
      color: 'bg-gray-500'
    }
  ];

  useEffect(() => {
    // Simular carregamento
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'like':
        return Heart;
      case 'comment':
        return MessageCircle;
      case 'share':
        return Share2;
      case 'follow':
        return Star;
      case 'news':
        return Bell;
      default:
        return Bell;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: false } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando notificações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Bell className="w-6 h-6 mr-2" />
                  Notificações
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-red-500">
                      {unreadCount}
                    </Badge>
                  )}
                </h1>
                <p className="text-gray-600">Acompanhe suas atividades e atualizações</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="unread">Não lidas</SelectItem>
                  <SelectItem value="read">Lidas</SelectItem>
                </SelectContent>
              </Select>
              
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  <Check className="w-4 h-4 mr-2" />
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'unread' ? 'Nenhuma notificação não lida' : 
                 filter === 'read' ? 'Nenhuma notificação lida' : 
                 'Nenhuma notificação'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' ? 'Você está em dia com suas notificações!' : 
                 'Quando algo interessante acontecer, você verá aqui.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              
              return (
                <Card 
                  key={notification.id} 
                  className={`transition-all duration-200 hover:shadow-md ${
                    !notification.read ? 'ring-2 ring-blue-100 bg-blue-50/30' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      {/* Avatar/Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notification.color}`}>
                        {notification.type === 'system' || notification.type === 'news' ? (
                          <Icon className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-white text-sm font-bold">
                            {notification.avatar}
                          </span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className={`text-sm ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {notification.time}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {notification.type}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center space-x-1 ml-4">
                            {!notification.read ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 h-8 w-8"
                                title="Marcar como lida"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsUnread(notification.id)}
                                className="p-1 h-8 w-8"
                                title="Marcar como não lida"
                              >
                                <BellDot className="w-4 h-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                              title="Excluir notificação"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Carregar mais notificações
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
