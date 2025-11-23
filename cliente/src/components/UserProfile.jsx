import React from 'react';
import { User, Mail, Calendar, Clock, Activity, Shield, ArrowLeft, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const UserProfile = ({ user, onBack, onLogout }) => {
  // Função para obter a data/hora atual de São Paulo
  // Dados do usuário com informações padrão
  const userData = {
    id: user?.id || 1,
    fullName: user?.name || user?.fullName || 'Eloiza Elias Maia Pereira',
    email: user?.email || 'eloiza@technews.com',
    username: user?.username || 'admin',
    createdAt: user?.createdAt,
    lastAccess: user?.lastAccess,
    accountType: user?.accountType || 'Padrão',
    status: user?.status || 'Ativa',
    loginCount: user?.loginsThisMonth || 0,
    newsRead: user?.articlesRead || 0,
    timeOnline: user?.onlineTime || '0h',
    yearsActive: user?.yearsActive || 0
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      // O backend já deve retornar a data no fuso horário correto e formatada.
      // Apenas exibe a string recebida.
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="bg-blue-600 text-white py-2">
          <div className="max-w-4xl mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <span>São Paulo, SP</span>
              <span>21°C - Ensolarado</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                {userData.fullName}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4">
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
                onClick={() => {}} 
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
        </div>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg p-8 text-white">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Informações da Conta</h2>
            <p className="text-gray-400">Gerencie suas informações pessoais e configurações</p>
          </div>

          {/* User Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Nome Completo */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 text-sm font-medium">Nome Completo</span>
                </div>
                <p className="text-white font-semibold">{userData.fullName}</p>
              </CardContent>
            </Card>

            {/* E-mail */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Mail className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 text-sm font-medium">E-mail</span>
                </div>
                <p className="text-white font-semibold">{userData.email}</p>
              </CardContent>
            </Card>

            {/* Usuário */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <User className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 text-sm font-medium">Usuário</span>
                </div>
                <p className="text-white font-semibold">{userData.username}</p>
              </CardContent>
            </Card>

            {/* ID do Usuário */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-blue-400 text-sm font-medium">Id Do Usuário</span>
                </div>
                <p className="text-white font-semibold">{userData.id}</p>
              </CardContent>
            </Card>
          </div>

          {/* Statistics */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-blue-400 text-lg font-medium">Estatísticas da Conta</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">{userData.loginCount}</div>
                  <div className="text-gray-400 text-sm">Logins este mês</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{userData.newsRead}</div>
                  <div className="text-gray-400 text-sm">Notícias lidas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">{userData.timeOnline}</div>
                  <div className="text-gray-400 text-sm">Tempo online</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400 mb-1">{userData.yearsActive}</div>
                  <div className="text-gray-400 text-sm">Anos ativo</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-blue-400 text-lg font-medium">Informações da Conta</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Data de criação:</span>
                  <span className="text-white font-semibold">{formatDate(userData.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Último acesso:</span>
                  <span className="text-white font-semibold">{formatDate(userData.lastAccess)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Tipo de conta:</span>
                  <span className="text-blue-400 font-semibold">{userData.accountType}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Status da conta:</span>
                  <span className="text-green-400 font-semibold flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    {userData.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={onBack}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao NewsTech
            </Button>
            <Button 
              onClick={onLogout}
              variant="destructive"
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair da Conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

