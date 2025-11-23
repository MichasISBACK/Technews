# Tech News - Portal de Notícias de Tecnologia

Portal de notícias de tecnologia desenvolvido como projeto acadêmico, com autenticação OAuth (Google e GitHub), sistema de favoritos, notificações e perfil de usuário.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca para construção de interfaces
- **Vite** - Build tool e dev server
- **Tailwind CSS 3** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones
- **Framer Motion** - Animações
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** (better-sqlite3) - Banco de dados
- **JWT** - Autenticação via tokens
- **bcryptjs** - Hash de senhas
- **Google Auth Library** - OAuth do Google
- **GitHub OAuth** - OAuth do GitHub

### APIs Externas
- **GNews API** - Notícias de tecnologia
- **NewsAPI** - Notícias complementares
- **OpenWeather API** - Dados de clima

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** (vem com o Node.js) ou **pnpm** (opcional)
- **Visual Studio Code** (recomendado) - [Download](https://code.visualstudio.com/)

## 🔐 Autenticação

O projeto suporta três métodos de autenticação:

### 1. Cadastro Tradicional
- Clique em "Não tem uma conta? Cadastre-se"
- Preencha os dados solicitados
- Senha deve ter no mínimo 8 caracteres

### 2. Login com Google
- Clique no botão "Continuar com Google"
- Selecione sua conta Google
- Autorize o acesso

### 3. Login com GitHub
- Clique no botão "Continuar com GitHub"
- Você será redirecionado para o GitHub
- Autorize a aplicação "newsTech"
- Será redirecionado de volta automaticamente

## 📁 Estrutura do Projeto

```
tela/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes de UI (Radix UI)
│   │   ├── TechNews.jsx     # Página principal de notícias
│   │   ├── UserProfile.jsx  # Perfil do usuário
│   │   ├── Settings.jsx     # Configurações
│   │   ├── Favorites.jsx    # Favoritos
│   │   └── ...
│   ├── config/              # Configurações
│   │   └── api.js           # URLs e configs de API
│   ├── constants/           # Constantes do projeto
│   │   └── index.js         # Validações, mensagens, etc.
│   ├── hooks/               # Hooks customizados
│   │   ├── AuthContext.jsx  # Contexto de autenticação
│   │   └── useFavorites.js  # Hook de favoritos
│   ├── services/            # Serviços de API
│   │   ├── authService.js   # Serviço de autenticação
│   │   ├── newsService.js   # Serviço de notícias
│   │   └── weatherService.js # Serviço de clima
│   ├── utils/               # Utilitários
│   │   └── formatters.js    # Formatadores de data, texto, etc.
│   ├── App.jsx              # Componente principal
│   ├── main.jsx             # Ponto de entrada
│   └── index.css            # Estilos globais
├── middleware/              # Middlewares do backend
│   └── auth.js              # Middleware de autenticação JWT
├── backend-server.js        # Servidor Express
├── database.js              # Configuração do SQLite
├── .env                     # Variáveis de ambiente (não commitar!)
├── .env.example             # Exemplo de variáveis de ambiente
├── package.json             # Dependências do projeto
├── vite.config.js           # Configuração do Vite
├── tailwind.config.js       # Configuração do Tailwind CSS
└── postcss.config.js        # Configuração do PostCSS
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento do frontend
- `npm run dev:backend` - Inicia o servidor backend
- `npm run dev:all` - Inicia frontend e backend simultaneamente
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

## ✨ Funcionalidades

- ✅ **Autenticação completa** (tradicional, Google OAuth, GitHub OAuth)
- ✅ **Sistema de tokens JWT** com validade de 7 dias
- ✅ **Persistência de sessão** no localStorage
- ✅ **Notícias de tecnologia** em tempo real
- ✅ **Sistema de favoritos**
- ✅ **Notificações**
- ✅ **Perfil de usuário** com estatísticas
- ✅ **Configurações** personalizáveis
- ✅ **Informações de clima**
- ✅ **Design responsivo** com Tailwind CSS
- ✅ **Componentes acessíveis** com Radix UI

## 🔒 Segurança

- Senhas hasheadas com **bcrypt** (10 rounds)
- Tokens **JWT** assinados com secret key
- Validação de dados no backend
- Sanitização de dados do usuário
- **CORS** configurado corretamente
- Proteção de rotas com middleware

## 👥 Autores

Luis Eduardo Carvalho Michaud   
Ronald Carvalho

## 📄 Licença

Este projeto é de uso acadêmico para á disciplina de Gestão de Projetos.

---

**Desenvolvido com ❤️ para o projeto Tech News**
