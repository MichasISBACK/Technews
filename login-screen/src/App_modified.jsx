import { useState, useEffect } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Github, ArrowLeft, Mail, Eye, EyeOff, Zap, Shield, Lock, User } from 'lucide-react'
import TechNews from './components/TechNews.jsx'
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
          const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            login(data, token); // Atualiza o contexto com os dados completos do usuário
          } else {
            console.error("Erro ao buscar dados do usuário:", data.message);
            logout();
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          logout();
        }
      };
      fetchUserData();
    }
  }, [])

  const handleLogin = async (e) => {
  e.preventDefault();

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

  // Se showUserProfile for true, renderizar perfil do usuário
  if (showUserProfile && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-black"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'1\'%2F%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="w-full max-w-2xl relative z-10">
          <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-900/40 border border-slate-600/50 rounded-2xl shadow-2xl shadow-black/30 p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5 rounded-2xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent tracking-wide" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                  Informações da Conta
                </h1>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60 mt-2"></div>
                <p className="text-slate-300 text-sm mt-2" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                  Gerencie suas informações pessoais e configurações
                </p>
              </div>
              
              {/* User Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800/70 border border-slate-600/50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <User className="w-5 h-5 text-blue-400 mr-2" />
                    <label className="text-blue-400 text-sm font-semibold tracking-wide" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Nome Completo</label>
                  </div>
                  <p className="text-slate-200 text-lg font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>{userInfo?.fullName || 'Não informado'}</p>
                </div>
                
                <div className="bg-slate-800/70 border border-slate-600/50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <Mail className="w-5 h-5 text-blue-400 mr-2" />
                    <label className="text-blue-400 text-sm font-semibold tracking-wide" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>E-mail</label>
                  </div>
                  <p className="text-slate-200 text-lg font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>{userInfo?.email || 'Não informado'}</p>
                </div>
                
                <div className="bg-slate-800/70 border border-slate-600/50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <User className="w-5 h-5 text-blue-400 mr-2" />
                    <label className="text-blue-400 text-sm font-semibold tracking-wide" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Usuário</label>
                  </div>
                  <p className="text-slate-200 text-lg font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>{userInfo?.username || userInfo?.login || 'Não informado'}</p>
                </div>
                
                <div className="bg-slate-800/70 border border-slate-600/50 rounded-lg p-6 shadow-sm">
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-blue-400 mr-2" />
                    <label className="text-blue-400 text-sm font-semibold tracking-wide" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Id Do Usuário</label>
                  </div>
                  <p className="text-slate-200 text-lg font-medium font-mono">{userInfo?.userId || userInfo?.id || 'Não informado'}</p>
                </div>
              </div>
              
              {/* Account Statistics */}
              <div className="bg-slate-800/70 border border-slate-600/50 rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                  <Zap className="w-5 h-5 text-blue-400 mr-2" />
                  Estatísticas da Conta
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                      >  {userInfo?.loginsThisMonth || '0'}
                      </div>
                    <div className="text-sm text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Logins este mês</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                      {userInfo?.articlesRead || '0'}
                    </div>
                    <div className="text-sm text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Notícias lidas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                      {userInfo?.onlineTime || '0h'}
                    </div>
                    <div className="text-sm text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Tempo online</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                      {userInfo?.yearsActive || '0'}
                    </div>
                    <div className="text-sm text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Anos ativo</div>
                  </div>
                </div>
              </div>
              
              {/* Account Information */}
              <div className="bg-slate-800/70 border border-slate-600/50 rounded-lg p-6 shadow-sm mb-8">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                  <Lock className="w-5 h-5 text-blue-400 mr-2" />
                  Informações da Conta
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-600">
                    <span className="text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Data de criação:</span>
                    <span className="text-slate-200 font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                      {userInfo?.createdAt || 'Não informado'}                   </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-600">
                    <span className="text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Último acesso:</span>
                    <span className="text-slate-200 font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}                      
                    >   {userInfo?.lastAccess || 'Não informado'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-600">
                    <span className="text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Tipo de conta:</span>
                    <span className="text-blue-400 font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                      {userInfo?.provider ? `OAuth (${userInfo.provider})` : 'Padrão'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Status da conta:</span>
                    <span className="text-green-400 font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>Ativa</span>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => setShowUserProfile(false)}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-400 hover:to-blue-600 text-white font-semibold tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-blue-500/25 hover:shadow-blue-400/40 border-0"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao TechNews
                </Button>
                
                <Button
                  onClick={handleLogout}
                  className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-semibold tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/25 hover:shadow-red-400/40 border-0"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Sair da Conta
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Se estiver logado e showTechNews for true, renderizar TechNews
  if (isLoggedIn && showTechNews) {
    return (
      <TechNews 
        onLogout={handleLogout}
        onShowProfile={() => setShowUserProfile(true)}
        userInfo={userInfo}
      />
    )
  }

  // Renderizar formulário de login/cadastro
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
              {isSignUp ? 'Criar conta' : isForgotPassword ? 'Recuperar senha' : 'Entrar'}
            </h1>
            <p className="text-slate-400 text-sm" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
              {isSignUp ? 'Crie sua conta para continuar' : isForgotPassword ? 'Digite seu email para recuperar a senha' : 'Entre com sua conta para continuar'}
            </p>
          </div>

          {/* Back Button for Forgot Password */}
          {isForgotPassword && (
            <button 
              onClick={resetToLogin}
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-6 text-sm"
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
                  <label className="block text-white text-sm font-medium mb-2" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                    Nome de usuário ou endereço de email
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-12 px-4 bg-slate-900 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-slate-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white text-sm font-medium" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                      Senha
                    </label>
                    <button 
                      type="button"
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
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
                    className="w-full h-12 px-4 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-slate-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                </div>
              </div>
              
              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
                style={{fontFamily: 'Inter, system-ui, sans-serif'}}
              >
                Entrar
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
                    className="w-full h-12 px-4 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-slate-400"
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
                    className="w-full h-12 px-4 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-slate-400"
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
                    className="w-full h-12 px-4 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-slate-400"
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
                    className="w-full h-12 px-4 pr-12 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-slate-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
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
                    className="w-full h-12 px-4 pr-12 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-slate-400"
                    style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
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
                <Input
                  type="email"
                  placeholder="Endereço de Email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-slate-400"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300"
                style={{fontFamily: 'Inter, system-ui, sans-serif'}}
              >
                Enviar recuperação
              </Button>
            </form>
          )}
          
          {/* Toggle between Login and Sign Up */}
          {!isForgotPassword && (
            <div className="text-center mt-6">
              <span className="text-slate-400 text-sm" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                {isSignUp ? 'Já tem uma conta?' : 'Quer criar uma conta?'}{" "}
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                >
                  {isSignUp ? 'Entrar' : 'Criar conta'}
                </button>
              </span>
            </div>
          )}
          
          {/* OAuth Section */}
          {!isSignUp && !isForgotPassword && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-slate-800 text-slate-400" style={{fontFamily: 'Inter, system-ui, sans-serif'}}>
                    ou
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Google OAuth Button */}
                <button
                  onClick={() => {
                    // Simular clique no Google Login
                    const googleButton = document.querySelector('[data-testid="google-login-button"]');
                    if (googleButton) googleButton.click();
                  }}
                  className="w-full h-12 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                >
                  <div className="w-5 h-5 mr-3">
                    <svg className="w-full h-full" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  Continuar com Google
                  {/* Hidden Google Login Component */}
                  <div className="absolute opacity-0 pointer-events-none">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      useOneTap={false}
                      theme="filled_blue"
                      shape="rectangular"
                      size="large"
                      text="signin"
                      data-testid="google-login-button"
                    />
                  </div>
                </button>
                
                {/* GitHub OAuth Button */}
                <button
                  onClick={handleGithubLogin}
                  className="w-full h-12 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{fontFamily: 'Inter, system-ui, sans-serif'}}
                >
                  <Github className="w-5 h-5 mr-3" />
                  Continuar com GitHub
                </button>
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

