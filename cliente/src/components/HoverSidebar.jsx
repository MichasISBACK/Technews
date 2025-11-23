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
import { ThemeToggle } from './ThemeToggle';

const HoverSidebar = ({ user, onProfile, onLogout, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200"
      >
        {isMobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`
          fixed left-0 top-0 h-full bg-background border-r border-border 
          shadow-lg z-40 transition-all duration-300 ease-in-out
          ${isExpanded || isMobileOpen ? 'w-64' : 'w-16'}
          ${isMobileOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full lg:block'}
        `}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div className={`ml-3 transition-all duration-300 ${isExpanded || isMobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                <h2 className="text-foreground font-semibold text-sm">TechNews</h2>
                <p className="text-muted-foreground text-xs">Portal de Tecnologia</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className={`p-3 border-b border-border transition-all duration-300 ${isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0'}`}>
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
        <nav className="flex-1 py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      relative w-full flex items-center p-3 rounded-lg transition-all duration-200
                      hover:bg-muted group
                      ${!isExpanded && !isMobileOpen ? 'justify-center' : ''}
                    `}
                    title={!isExpanded && !isMobileOpen ? item.label : ''}
                  >
                    {/* Icon Container */}
                    <div className={`
                      flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0
                      transition-all duration-200 group-hover:scale-110 text-white
                      ${item.color}
                    `}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    {/* Label */}
                    <span className={`
                      ml-3 font-medium text-foreground transition-all duration-300 text-sm
                      ${isExpanded || isMobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
                    `}>
                      {item.label}
                    </span>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className={`
                        ml-auto bg-red-500 text-white text-xs font-bold 
                        px-2 py-0.5 rounded-full min-w-[18px] h-5 flex items-center justify-center
                        transition-all duration-300
                        ${isExpanded || isMobileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

	        {/* Theme Toggle */}
	        <div className="p-2 border-t border-border">
	          <ThemeToggle isExpanded={isExpanded || isMobileOpen} />
	        </div>
	
	        {/* Logout Section */}
	        <div className="border-t border-border p-2">
          <button
            onClick={onLogout}
            className={`
              w-full flex items-center p-3 rounded-lg transition-all duration-200
              text-destructive hover:bg-destructive/10 group
              ${!isExpanded && !isMobileOpen ? 'justify-center' : ''}
            `}
            title={!isExpanded && !isMobileOpen ? 'Sair' : ''}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 bg-red-500 text-white group-hover:bg-red-600 transition-all duration-200">
              <LogOut className="w-4 h-4" />
            </div>
            <span className={`
              ml-3 font-medium transition-all duration-300 text-sm
              ${isExpanded || isMobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}
            `}>
              Sair
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className={`
          p-3 border-t border-border transition-all duration-300
          ${isExpanded || isMobileOpen ? 'opacity-100' : 'opacity-0'}
        `}>
          <p className="text-center text-xs text-muted-foreground">
            © 2025 TechNews
          </p>
        </div>
      </div>

      {/* Sidebar Spacer for Desktop */}
      <div className="hidden lg:block w-16" />
    </>
  );
};

export default HoverSidebar;
