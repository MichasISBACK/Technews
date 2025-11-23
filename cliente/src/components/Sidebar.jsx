import React, { useState } from 'react';
import { 
  Home, 
  User, 
  Settings, 
  Bell, 
  Heart, 
  LogOut, 
  Calendar,
  Menu,
  X
} from 'lucide-react';

// Largura fixa da sidebar
const SIDEBAR_WIDTH = 'w-64';
const SIDEBAR_WIDTH_CLASS = '256px'; // Largura em pixels para o espaçador

const Sidebar = ({ user, onProfile, onLogout, onNavigate }) => {
  // Mantemos isMobileOpen para responsividade
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { 
      id: 'home', 
      icon: Home, 
      label: 'Início', 
      onClick: () => onNavigate('home'),
      color: 'bg-blue-500'
    },
    { 
      id: 'perfil', 
      icon: User, 
      label: 'Perfil', 
      onClick: onProfile,
      color: 'bg-green-500'
    },
    { 
      id: 'feira-xii', 
      icon: Calendar, 
      label: 'Feira XII', 
      onClick: () => onNavigate('feira-xii'),
      color: 'bg-purple-500'
    },
    { 
      id: 'notificacoes', 
      icon: Bell, 
      label: 'Notificações', 
      onClick: () => onNavigate('notificacoes'),
      badge: '3',
      color: 'bg-orange-500'
    },
    { 
      id: 'favoritos', 
      icon: Heart, 
      label: 'Favoritos', 
      onClick: () => onNavigate('favoritos'),
      color: 'bg-red-500'
    },
    { 
      id: 'configuracoes', 
      icon: Settings, 
      label: 'Configurações', 
      onClick: () => onNavigate('configuracoes'),
      color: 'bg-gray-500'
    }
  ];

  const handleItemClick = (item) => {
    item.onClick();
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Mantido para responsividade */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-border text-foreground"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Agora fixa e expandida */}
      <div 
        className={`
          fixed left-0 top-0 h-full bg-background border-r border-border 
          shadow-lg z-40 transition-transform duration-300 ease-in-out
          ${SIDEBAR_WIDTH}
          ${isMobileOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full lg:block'}
        `}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div className="ml-3">
              <h2 className="text-foreground font-semibold text-sm">TechNews</h2>
              <p className="text-muted-foreground text-xs">Portal de Tecnologia</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-3 border-b border-border">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-foreground font-medium text-sm truncate">
                  {user?.fullName || user?.username || 'Usuário'}
                </p>
                <p className="text-muted-foreground text-xs truncate">
                  {user?.email || 'usuario@exemplo.com'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto h-[calc(100vh-250px)]">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      relative w-full flex items-center p-3 rounded-lg transition-colors duration-200
                      hover:bg-muted group
                    `}
                  >
                    {/* Icon Container */}
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
                      transition-all duration-200 text-white
                      ${item.color}
                    `}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    {/* Label */}
                    <span className="ml-3 font-medium text-foreground text-sm">
                      {item.label}
                    </span>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[18px] h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="absolute bottom-0 w-full border-t border-border p-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center p-3 rounded-lg transition-colors duration-200 text-destructive hover:bg-destructive/10 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 bg-red-500 text-white group-hover:bg-red-600 transition-all duration-200">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="ml-3 font-medium text-sm">
              Sair
            </span>
          </button>
          
          {/* Footer */}
          <div className="p-3 border-t border-border mt-2">
            <p className="text-center text-xs text-muted-foreground">
              © 2025 TechNews
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar Spacer for Desktop */}
      <div className="hidden lg:block" style={{ width: SIDEBAR_WIDTH_CLASS }} />
    </>
  );
};

export default Sidebar;
