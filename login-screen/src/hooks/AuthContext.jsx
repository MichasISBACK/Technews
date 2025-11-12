import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null); // Adicionado para armazenar informações detalhadas
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Adicionado para controlar o estado de login

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setUserInfo(parsedUser); // Define userInfo com os dados salvos
        setIsLoggedIn(true);
        // Atualiza o lastAccess com o horário atual de São Paulo ao carregar
        const saoPauloOffset = -3 * 60; // -3 horas em minutos
        const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
        const saoPauloTime = new Date(utc + (saoPauloOffset * 60000));
        parsedUser.lastAccess = saoPauloTime.toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).replace(",", "");
        setUserInfo(parsedUser);
      } catch (error) {
        console.error("Erro ao parsear usuário salvo:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setUserInfo(userData); // Atualiza userInfo no login
    setIsLoggedIn(true);
  };

  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserInfo(null); // Limpa userInfo no logout
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ user, userInfo, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


