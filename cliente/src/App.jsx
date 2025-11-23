import { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Github, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import TechNewsRefactored from './components/TechNews_Refactored.jsx';
import UserProfile from './components/UserProfile.jsx';
import Sidebar from './components/Sidebar.jsx';
import Settings from './components/Settings.jsx';
import Notifications from './components/Notifications.jsx';
import Favorites from './components/Favorites.jsx';
import FeiraXII from './components/FeiraXII.jsx';
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import authService from './services/authService';
import { OAUTH_CONFIG } from './config/api';
import { VALIDATION } from './constants';

/**
 * Componente de callback para autenticação OAuth
 */
const AuthCallback = () => {
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');

    if (token && userId) {
      console.log("Callback OAuth recebido. Buscando dados do usuário...");
      
      const fetchUserData = async () => {
        try {
          const userData = await authService.getUserData(userId, token);
          login(userData, token);
          window.history.replaceState({}, document.title, "/");
        } catch (error) {
          console.error("Erro no callback OAuth:", error);
          window.location.href = "/";
        }
      };
      
      fetchUserData();
    } else {
      console.log("Callback acessado sem token, redirecionando para home.");
      window.location.href = "/";
    }
  }, [login]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Autenticando...</p>
      </div>
    </div>
  );
};

/**
 * Componente principal de login
 */
function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, logout, userInfo, isLoggedIn, isLoading: authLoading } = useAuth();
  
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  /**
   * Manipula o login tradicional
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      const data = await authService.login(username, password);
      login(data.user, data.token);
    } catch (error) {
      console.error("Erro de login:", error);
      setErrorMessage(error.message || "Falha no login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manipula o cadastro de novo usuário
   */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Validações
    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMessage('As senhas não coincidem!');
      return;
    }
    
    if (signUpData.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      setErrorMessage(`A senha deve ter pelo menos ${VALIDATION.MIN_PASSWORD_LENGTH} caracteres!`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const data = await authService.register(
        signUpData.fullName,
        signUpData.email,
        signUpData.username,
        signUpData.password
      );
      
      // Faz login automaticamente após o cadastro
      login(data.user, data.token);
    } catch (error) {
      console.error("Erro de cadastro:", error);
      setErrorMessage(error.message || "Falha no cadastro. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manipula a recuperação de senha
   */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotPasswordEmail) {
      setErrorMessage('Por favor, digite seu email.');
      return;
    }
    
    alert(`Se um usuário com o email ${forgotPasswordEmail} existir, um link de recuperação será enviado.`);
    setForgotPasswordEmail('');
    setIsForgotPassword(false);
  };

  /**
   * Manipula o sucesso do login com Google
   */
  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Login Google bem-sucedido, enviando para o backend...');
    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const idToken = credentialResponse.credential;
      const data = await authService.googleAuth(idToken);
      login(data.user, data.token);
    } catch (error) {
      console.error("Erro ao fazer login com Google:", error);
      setErrorMessage("Erro ao fazer login com Google. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Manipula erro do login com Google
   */
  const handleGoogleError = (error) => {
    console.error('Erro no login Google:', error);
    setErrorMessage('O login com Google falhou. Tente novamente.');
  };

  /**
   * Inicia o fluxo de login com GitHub
   */
  const handleGithubLogin = () => {
    console.log('Redirecionando para autenticação GitHub...');
    authService.initiateGithubAuth();
  };

  /**
   * Manipula o logout
   */
  const handleLogout = () => {
    logout();
    setCurrentPage('home');
    setUsername('');
    setPassword('');
    setSignUpData({
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
  };

  /**
   * Manipula a navegação entre páginas
   */
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  /**
   * Manipula mudanças nos campos de cadastro
   */
  const handleSignUpInputChange = (field, value) => {
    setSignUpData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Reseta para a tela de login
   */
  const resetToLogin = () => {
    setIsSignUp(false);
    setIsForgotPassword(false);
    setForgotPasswordEmail('');
    setErrorMessage('');
  };

  // Renderiza loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se estiver logado, renderiza a aplicação principal
  if (isLoggedIn) {
    const renderCurrentPage = () => {
      switch (currentPage) {
        case 'home':
          return <TechNewsRefactored user={userInfo} onLogout={handleLogout} onProfile={() => handleNavigation('perfil')} />;
        case 'perfil':
          return <UserProfile user={userInfo} onLogout={handleLogout} onBack={() => handleNavigation('home')} />;
        case 'configuracoes':
          return <Settings user={userInfo} onBack={() => handleNavigation('home')} />;
        case 'notificacoes':
          return <Notifications user={userInfo} onBack={() => handleNavigation('home')} />;
        case 'favoritos':
          return <Favorites user={userInfo} onBack={() => handleNavigation('home')} />;
        case 'feira-xii':
          return <FeiraXII user={userInfo} onBack={() => handleNavigation('home')} />;
        default:
          return <TechNewsRefactored user={userInfo} onLogout={handleLogout} onProfile={() => handleNavigation('perfil')} />;
      }
    };

    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar 
          user={userInfo}
          onProfile={() => handleNavigation('perfil')}
          onLogout={handleLogout}
          onNavigate={handleNavigation}
        />
        <div className="flex-1">
          {renderCurrentPage()}
        </div>
      </div>
    );
  }

  // Renderiza tela de login
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-8">
          {/* Logo e título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isForgotPassword ? 'Recuperar Senha' : isSignUp ? 'Criar Conta' : 'Tech News'}
            </h1>
            <p className="text-gray-600">
              {isForgotPassword 
                ? 'Digite seu email para recuperar sua senha' 
                : isSignUp 
                ? 'Cadastre-se para acessar' 
                : 'Faça login para continuar'}
            </p>
          </div>

          {/* Mensagem de erro */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errorMessage}</p>
            </div>
          )}

          {/* Formulário de recuperação de senha */}
          {isForgotPassword && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              </Button>

              <button
                type="button"
                onClick={resetToLogin}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para o login
              </button>
            </form>
          )}

          {/* Formulário de cadastro */}
          {!isForgotPassword && isSignUp && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <Input
                  type="text"
                  value={signUpData.fullName}
                  onChange={(e) => handleSignUpInputChange('fullName', e.target.value)}
                  placeholder="João Silva"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => handleSignUpInputChange('email', e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome de Usuário
                </label>
                <Input
                  type="text"
                  value={signUpData.username}
                  onChange={(e) => handleSignUpInputChange('username', e.target.value)}
                  placeholder="usuario123"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={signUpData.password}
                    onChange={(e) => handleSignUpInputChange('password', e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={signUpData.confirmPassword}
                    onChange={(e) => handleSignUpInputChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Cadastrando...' : 'Criar Conta'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Já tem uma conta? Faça login
                </button>
              </div>
            </form>
          )}

          {/* Formulário de login */}
          {!isForgotPassword && !isSignUp && (
            <>
              <form onSubmit={handleLogin} className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usuário ou Email
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuario ou email"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Lembrar-me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>

              {/* Divisor */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                </div>
              </div>

              {/* Botões OAuth */}
              <div className="space-y-3">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="continue_with"
                  width="100%"
                />

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGithubLogin}
                  disabled={isLoading}
                >
                  <Github className="w-5 h-5" />
                  Continuar com GitHub
                </Button>
              </div>

              {/* Link para cadastro */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Não tem uma conta? Cadastre-se
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Componente principal da aplicação
 */
function App() {
  // Verifica se está na rota de callback ou se há parâmetros de token na URL
  const params = new URLSearchParams(window.location.search);
  const hasTokenParams = params.has('token') && params.has('userId');
  const isCallbackRoute = window.location.pathname === '/auth/callback' || hasTokenParams;

  return (
    <GoogleOAuthProvider clientId={OAUTH_CONFIG.GOOGLE_CLIENT_ID}>
      <AuthProvider>
        {isCallbackRoute ? <AuthCallback /> : <LoginForm />}
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
