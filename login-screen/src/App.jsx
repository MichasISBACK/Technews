import { useState, useEffect } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Github, ArrowLeft, Mail, Eye, EyeOff, Zap, Shield, Lock, User } from 'lucide-react'
import TechNews from './components/TechNews.jsx'
import UserProfile from './components/UserProfile.jsx'
import { AuthProvider } from "./hooks/AuthContext";
import { useAuth } from "./hooks/AuthContext";
import './App.css'

// Configurações OAuth
const GOOGLE_CLIENT_ID = "536891634854-p52nh1e2kci76937mcesj9fkbp90m1qe.apps.googleusercontent.com";
const GITHUB_CLIENT_ID = "Ov23li9zpPe5QYsuCtSI";

function LoginForm() {
  
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [showTechNews, setShowTechNews] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showUserProfile, setShowUserProfile] = useState(false)
  
  // Estados para Login
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

   // pega as funções e dados do contexto
  const { login, logout, user, userInfo, isLoggedIn } = useAuth();
  
  // Estados para Cadastro
  const [signUpData, setSignUpData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })

  // Estados para Esqueceu a Senha
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')

  // Verificar se há token salvo ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId"); // Assumindo que o userId é salvo no localStorage

    if (token && userId) {
      const fetchUserData = async () => {
        try {
          // Simular um usuário logado do localStorage
          const savedUser = JSON.parse(localStorage.getItem("user"));
          if (savedUser && savedUser.id == userId) {
            // Atualiza o lastAccess com o horário atual de São Paulo ao carregar
            const saoPauloOffset = -3 * 60; // -3 horas em minutos
            const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
            const saoPauloTime = new Date(utc + (saoPauloOffset * 60000));
            savedUser.lastAccess = saoPauloTime.toLocaleDateString("pt-BR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }).replace(",", "");
            login(savedUser, token);
            setShowTechNews(true);
          } else {
            // Se não for o usuário de teste ou não houver usuário salvo, tenta buscar do backend
            const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            });
            const data = await response.json();
            if (response.ok) {
              login(data, token); // Atualiza o contexto com os dados completos do usuário
              setShowTechNews(true);
            } else {
              console.error("Erro ao buscar dados do usuário:", data.message);
              logout();
            }
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          logout();
        }
      };
      fetchUserData();
    }
  }, [login, logout, setShowTechNews])

  const handleLogin = async (e) => {
  e.preventDefault();

  // Login de teste para demonstração
  if (username === 'admin' && password === '123456') {
    // Função para obter data/hora atual de São Paulo
    const getCurrentSaoPauloTime = () => {
      const now = new Date();
      const saoPauloOffset = -3 * 60; // -3 horas em minutos
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const saoPauloTime = new Date(utc + (saoPauloOffset * 60000));
      
      return saoPauloTime.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).replace(',', '');
    };

    const testUser = {
      id: 1,
      name: 'Eloiza Elias Maia P...',
      fullName: 'Eloiza Elias Maia Pereira',
      username: 'admin',
      email: 'eloiza@technews.com',
      createdAt: '09/09/2025 03:31:33',
      lastAccess: getCurrentSaoPauloTime(),
      accountType: 'Padrão',
      status: 'Ativa',
      loginCount: 15,
      newsRead: 0,
      timeOnline: '0h',
      yearsActive: 0
    };
    
    login(testUser, 'test-token');
    localStorage.setItem("userId", testUser.id);
    setShowTechNews(true);
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Falha no login.");
    }

    // agora usa o contexto
    login(data.user, data.token);
    localStorage.setItem("userId", data.user.id);

    // não precisa mais setar manualmente isLoggedIn/userInfo,
    // o contexto já cuida disso
    setShowTechNews(true);

  } catch (error) {
    console.error("Erro de login:", error);
    alert(error.message);
  }
};


  const handleSignUp = async (e) => {
    e.preventDefault()
    
    // Validações básicas
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('As senhas não coincidem!')
      return
    }
    
    if (signUpData.password.length < 8) {
      alert('A senha deve ter pelo menos 8 caracteres!')
      return
    }
    
    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: signUpData.fullName,
          email: signUpData.email,
          username: signUpData.username,
          password: signUpData.password
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Falha no cadastro.")
      }

      // Limpar formulário e voltar para login
      setSignUpData({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
      })
      setIsSignUp(false)
      
    } catch (error) {
      console.error("Erro de cadastro:", error)
      alert(error.message)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    
    if (!forgotPasswordEmail) {
      alert('Por favor, digite seu email.')
      return
    }
    
    try {
      // Simulação de envio de email de recuperação
      alert(`Um email de recuperação foi enviado para: ${forgotPasswordEmail}`)
      
      // Limpar formulário e voltar para login
      setForgotPasswordEmail('')
      setIsForgotPassword(false)
      
    } catch (error) {
      console.error("Erro ao enviar email de recuperação:", error)
      alert("Erro ao enviar email de recuperação. Tente novamente.")
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log('Login Google bem-sucedido:', credentialResponse)
    const idToken = credentialResponse.credential

    try {
      const response = await fetch("http://localhost:8000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Falha na autenticação Google.")
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userId", data.user.id);
      login(data.user, data.token);
      // Redirecionar para TechNews após login bem-sucedido
      setShowTechNews(true)
      
    } catch (error) {
      console.error("Erro ao enviar ID Token Google para o backend:", error)
      alert("Erro ao fazer login com Google. Tente novamente.")
    }
  }

  const handleGoogleError = () => {
    console.log('Erro no login Google')
    alert('Erro ao fazer login com Google. Tente novamente.')
  }

  const handleGithubLogin = () => {
    console.log('Iniciando login GitHub real...')
    const redirectUri = 'http://localhost:8000/api/auth/github/callback'
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`
    
    // Redireciona para o GitHub para autorização real
    window.location.href = githubAuthUrl
  }

  const handleLogout = () => {
  logout();  // limpa contexto e localStorage
  localStorage.removeItem("userId");
  setShowTechNews(false);
  setShowUserProfile(false);

  // resetar só os formulários locais
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

  const handleSignUpInputChange = (field, value) => {
    setSignUpData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetToLogin = () => {
    setIsSignUp(false)
    setIsForgotPassword(false)
    setForgotPasswordEmail('')
  }

  // Se estiver logado e showUserProfile for true, renderizar UserProfile
  if (isLoggedIn && showUserProfile) {
    return (
      <UserProfile 
        user={userInfo}
        onLogout={handleLogout}
        onBack={() => {
          setShowUserProfile(false)
          setShowTechNews(true)
        }}
      />
    )
  }

  // Se estiver logado e showTechNews for true, renderizar TechNews
  if (isLoggedIn && showTechNews) {
    return (
      <TechNews 
        user={userInfo}
        onLogout={handleLogout}
        onProfile={() => setShowUserProfile(true)}
        onBack={() => setShowTechNews(false)}
        userInfo={userInfo}
      />
    )
  }

  // Renderizar formulário de login/cadastro
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 tech-news-gradient" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
              {isSignUp ? 'TechNews' : isForgotPassword ? 'TechNews' : 'TechNews'}
            </h1>
            <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
              {isSignUp ? 'Crie sua conta para continuar' : isForgotPassword ? 'Digite seu email para recuperar a senha' : 'Entre com sua conta para continuar'}
            </p>
          </div>

          {/* Back Button for Forgot Password */}
          {isForgotPassword && (
            <button 
              onClick={resetToLogin}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-6 text-sm"
              style={{fontFamily: 'Inter, system-ui, sans-serif'}}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Voltar ao login
            </button>
          )}
          
          {/* Login Form */}
          {!isSignUp && !isForgotPassword && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                    Nome de usuário ou endereço de email
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-700 text-sm font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                      Senha
                    </label>
                    <button 
                      type="button"
                      className="text-blue-600 hover:text-blue-700 transition-colors text-sm"
                      style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                      onClick={() => setIsForgotPassword(true)}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                </div>
              </div>
              
              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                style={{fontFamily: 'Inter, system-ui, sans-serif'}}
              >
                Entrar no TechNews
              </Button>
            </form>
          )}
          
          {/* Sign Up Form */}
          {isSignUp && !isForgotPassword && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    placeholder="Nome Completo"
                    value={signUpData.fullName}
                    onChange={(e) => handleSignUpInputChange('fullName', e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    type="email"
                    placeholder="Endereço de Email"
                    value={signUpData.email}
                    onChange={(e) => handleSignUpInputChange('email', e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                </div>
                
                <div>
                  <Input
                    type="text"
                    placeholder="Usuário"
                    value={signUpData.username}
                    onChange={(e) => handleSignUpInputChange('username', e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                </div>
                
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha (Mín 8 caracteres)"
                    value={signUpData.password}
                    onChange={(e) => handleSignUpInputChange('password', e.target.value)}
                    className="w-full h-12 px-4 pr-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar Senha"
                    value={signUpData.confirmPassword}
                    onChange={(e) => handleSignUpInputChange('confirmPassword', e.target.value)}
                    className="w-full h-12 px-4 pr-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                style={{fontFamily: 'Inter, system-ui, sans-serif'}}
              >
                Criar conta
              </Button>
            </form>
          )}
          
          {/* Forgot Password Form */}
          {isForgotPassword && !isSignUp && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                  Endereço de email
                </label>
                <Input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                  placeholder="Digite seu email"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                style={{fontFamily: 'Inter, system-ui, sans-serif'}}
              >
                Enviar email de recuperação
              </Button>
            </form>
          )}
          
          {/* Footer */}
          {!isForgotPassword && (
            <>
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                  {isSignUp ? 'Já tem uma conta?' : 'Quer criar uma conta?'}{' '}
                  <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                  >
                    {isSignUp ? 'Entrar' : 'Criar conta'}
                  </button>
                </p>
              </div>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full h-px bg-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                      ou
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  {/* Google OAuth Button - Versão Corrigida */}
                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      theme="filled_blue"
                      shape="rectangular"
                      size="large"
                      text="signin_with"
                      width="100%"
                      locale="pt-BR"
                    />
                  </div>
                  
                  {/* GitHub OAuth Button */}
                  <button
                    onClick={handleGithubLogin}
                    className="w-full h-12 bg-gray-800 hover:bg-gray-900 border border-gray-300 text-white rounded-lg flex items-center justify-center transition-all duration-300"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                  >
                    <Github className="w-5 h-5 mr-3" />
                    Continuar com GitHub
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <LoginForm />
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

