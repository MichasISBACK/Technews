import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download,
  Trash2,
  Eye,
  EyeOff,
  Save,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

const Settings = ({ user, onBack }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Configurações de perfil
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
    bio: user?.bio || '',
    
    // Configurações de notificação
    emailNotifications: true,
    pushNotifications: true,
    newsAlerts: true,
    weeklyDigest: false,
    
    // Configurações de privacidade
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    
    // Configurações de aparência
    theme: 'light',
    language: 'pt-BR',
    fontSize: 'medium',
    
    // Configurações de dados
    autoSave: true,
    dataBackup: true
  });

  const sections = [
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      color: 'bg-blue-500'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      color: 'bg-yellow-500'
    },
    {
      id: 'privacy',
      label: 'Privacidade',
      icon: Shield,
      color: 'bg-green-500'
    },
    {
      id: 'appearance',
      label: 'Aparência',
      icon: Palette,
      color: 'bg-purple-500'
    },
    {
      id: 'data',
      label: 'Dados',
      icon: Download,
      color: 'bg-orange-500'
    }
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Aqui você salvaria as configurações
    console.log('Salvando configurações:', settings);
    alert('Configurações salvas com sucesso!');
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      // Reset para valores padrão
      setSettings({
        fullName: user?.fullName || '',
        email: user?.email || '',
        username: user?.username || '',
        bio: '',
        emailNotifications: true,
        pushNotifications: true,
        newsAlerts: true,
        weeklyDigest: false,
        profileVisibility: 'public',
        showEmail: false,
        showActivity: true,
        theme: 'light',
        language: 'pt-BR',
        fontSize: 'medium',
        autoSave: true,
        dataBackup: true
      });
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
        <Input
          value={settings.fullName}
          onChange={(e) => handleSettingChange('fullName', e.target.value)}
          placeholder="Seu nome completo"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <Input
          type="email"
          value={settings.email}
          onChange={(e) => handleSettingChange('email', e.target.value)}
          placeholder="seu@email.com"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nome de Usuário</label>
        <Input
          value={settings.username}
          onChange={(e) => handleSettingChange('username', e.target.value)}
          placeholder="@seuusuario"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg resize-none"
          rows={3}
          value={settings.bio}
          onChange={(e) => handleSettingChange('bio', e.target.value)}
          placeholder="Conte um pouco sobre você..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Digite uma nova senha (opcional)"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Notificações por Email</h4>
          <p className="text-sm text-gray-500">Receba atualizações importantes por email</p>
        </div>
        <Switch
          checked={settings.emailNotifications}
          onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Notificações Push</h4>
          <p className="text-sm text-gray-500">Receba notificações no navegador</p>
        </div>
        <Switch
          checked={settings.pushNotifications}
          onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Alertas de Notícias</h4>
          <p className="text-sm text-gray-500">Seja notificado sobre notícias importantes</p>
        </div>
        <Switch
          checked={settings.newsAlerts}
          onCheckedChange={(checked) => handleSettingChange('newsAlerts', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Resumo Semanal</h4>
          <p className="text-sm text-gray-500">Receba um resumo das principais notícias da semana</p>
        </div>
        <Switch
          checked={settings.weeklyDigest}
          onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
        />
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Visibilidade do Perfil</label>
        <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange('profileVisibility', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Público</SelectItem>
            <SelectItem value="friends">Apenas Amigos</SelectItem>
            <SelectItem value="private">Privado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Mostrar Email</h4>
          <p className="text-sm text-gray-500">Permitir que outros vejam seu email</p>
        </div>
        <Switch
          checked={settings.showEmail}
          onCheckedChange={(checked) => handleSettingChange('showEmail', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Mostrar Atividade</h4>
          <p className="text-sm text-gray-500">Mostrar suas atividades recentes</p>
        </div>
        <Switch
          checked={settings.showActivity}
          onCheckedChange={(checked) => handleSettingChange('showActivity', checked)}
        />
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
        <Select value={settings.theme} onValueChange={(value) => handleSettingChange('theme', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Claro</SelectItem>
            <SelectItem value="dark">Escuro</SelectItem>
            <SelectItem value="auto">Automático</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
        <Select value={settings.language} onValueChange={(value) => handleSettingChange('language', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
            <SelectItem value="en-US">English (US)</SelectItem>
            <SelectItem value="es-ES">Español</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho da Fonte</label>
        <Select value={settings.fontSize} onValueChange={(value) => handleSettingChange('fontSize', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Pequena</SelectItem>
            <SelectItem value="medium">Média</SelectItem>
            <SelectItem value="large">Grande</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Salvamento Automático</h4>
          <p className="text-sm text-gray-500">Salvar automaticamente suas preferências</p>
        </div>
        <Switch
          checked={settings.autoSave}
          onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Backup de Dados</h4>
          <p className="text-sm text-gray-500">Fazer backup dos seus dados regularmente</p>
        </div>
        <Switch
          checked={settings.dataBackup}
          onCheckedChange={(checked) => handleSettingChange('dataBackup', checked)}
        />
      </div>
      
      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Gerenciar Dados</h4>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="w-4 h-4 mr-2" />
            Exportar Dados
          </Button>
          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Conta
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSection();
      case 'notifications':
        return renderNotificationsSection();
      case 'privacy':
        return renderPrivacySection();
      case 'appearance':
        return renderAppearanceSection();
      case 'data':
        return renderDataSection();
      default:
        return renderProfileSection();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600">Gerencie suas preferências e configurações</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seções</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500' 
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.color}`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {sections.find(s => s.id === activeSection)?.label}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {activeSection === 'profile' && 'Gerencie suas informações pessoais'}
                      {activeSection === 'notifications' && 'Configure como você quer ser notificado'}
                      {activeSection === 'privacy' && 'Controle sua privacidade e visibilidade'}
                      {activeSection === 'appearance' && 'Personalize a aparência da interface'}
                      {activeSection === 'data' && 'Gerencie seus dados e backups'}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {sections.find(s => s.id === activeSection)?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {renderContent()}
                
                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-8 border-t">
                  <Button variant="outline" onClick={handleReset} className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restaurar Padrão
                  </Button>
                  <Button onClick={handleSave} className="flex items-center">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
