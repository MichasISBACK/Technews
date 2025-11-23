import { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restaura sessão ao carregar a aplicação
  useEffect(() => {
    const restoreSession = async () => {
      const authData = authService.getStoredAuthData();
      
      if (authData && authData.token && authData.userId) {
        // Verifica se o token ainda é válido
        if (authService.isTokenValid(authData.token)) {
          try {
            // Busca dados atualizados do usuário
            const userData = await authService.getUserData(authData.userId, authData.token);
            
            // Atualiza o lastAccess com horário de São Paulo
            const updatedUser = {
              ...userData,
              lastAccess: getCurrentSaoPauloTime()
            };
            
            setUser(updatedUser);
            setUserInfo(updatedUser);
            setIsLoggedIn(true);
            
            // Atualiza os dados no localStorage
            authService.saveAuthData(updatedUser, authData.token);
          } catch (error) {
            console.error("Erro ao restaurar sessão:", error);
            logout();
          }
        } else {
          console.log("Token expirado. Fazendo logout.");
          logout();
        }
      }
      
      setIsLoading(false);
    };

    restoreSession();
  }, []);

  /**
   * Obtém o horário atual de São Paulo formatado
   */
  const getCurrentSaoPauloTime = () => {
    const saoPauloOffset = -3 * 60; // -3 horas em minutos
    const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
    const saoPauloTime = new Date(utc + (saoPauloOffset * 60000));
    
    return saoPauloTime.toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).replace(",", "");
  };

  /**
   * Realiza login e salva os dados do usuário
   */
  const login = (userData, token) => {
    const updatedUser = {
      ...userData,
      lastAccess: getCurrentSaoPauloTime()
    };
    
    authService.saveAuthData(updatedUser, token);
    setUser(updatedUser);
    setUserInfo(updatedUser);
    setIsLoggedIn(true);
  };

  /**
   * Atualiza os dados do usuário sem fazer novo login
   */
  const updateUser = (userData) => {
    const authData = authService.getStoredAuthData();
    if (authData && authData.token) {
      authService.saveAuthData(userData, authData.token);
      setUser(userData);
      setUserInfo(userData);
    }
  };

  /**
   * Realiza logout e limpa todos os dados
   */
  const logout = () => {
    authService.clearAuthData();
    setUser(null);
    setUserInfo(null);
    setIsLoggedIn(false);
  };

  /**
   * Verifica se o usuário está autenticado e o token é válido
   */
  const checkAuth = () => {
    const authData = authService.getStoredAuthData();
    return authData && authService.isTokenValid(authData.token);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        userInfo, 
        isLoggedIn, 
        isLoading,
        login, 
        logout,
        updateUser,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
