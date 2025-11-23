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

## 🔧 Instalação

### 1. Extrair o Projeto

Extraia o arquivo `technews_final.zip` para uma pasta de sua preferência.

### 2. Abrir no VS Code

1. Abra o Visual Studio Code
2. Vá em **File > Open Folder** (ou **Arquivo > Abrir Pasta**)
3. Selecione a pasta `tela` que foi extraída

### 3. Instalar Dependências

Abra o terminal integrado do VS Code (Ctrl + ` ou Cmd + `) e execute:

```bash
npm install
```

**Nota:** Este processo pode levar alguns minutos na primeira vez.

### 4. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado com todas as chaves de API necessárias. **Não é necessário fazer alterações** para testar o projeto.

Se você quiser usar suas próprias chaves de API, edite o arquivo `.env` seguindo o modelo do `.env.example`.

## ▶️ Executando o Projeto

### Opção 1: Executar Frontend e Backend Juntos (Recomendado)

```bash
npm run dev:all
```

Isso iniciará:
- **Frontend** em `http://localhost:5174`
- **Backend** em `http://localhost:8000`

### Opção 2: Executar Frontend e Backend Separadamente

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

### Acessar a Aplicação

Abra seu navegador e acesse: `http://localhost:5174`

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

## 🐛 Solução de Problemas

### Erro: "Port 5174 is already in use"

A porta 5174 já está em uso. Você pode:
1. Fechar o processo que está usando a porta
2. Ou alterar a porta no `vite.config.js`

### Erro: "Port 8000 is already in use"

A porta 8000 já está em uso. Você pode:
1. Fechar o processo que está usando a porta
2. Ou alterar a porta no arquivo `.env` (variável `PORT`)

### Estilos não carregam

Se os estilos do Tailwind CSS não carregarem:
1. Certifique-se de que executou `npm install`
2. Reinicie o servidor de desenvolvimento
3. Limpe o cache do navegador (Ctrl + Shift + R)

### OAuth do Google não funciona

Verifique se:
1. O `GOOGLE_CLIENT_ID` está correto no arquivo `.env`
2. A URL de callback está configurada no Google Cloud Console
3. O backend está rodando na porta 8000

### OAuth do GitHub retorna 404

Verifique se:
1. O `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET` estão corretos no `.env`
2. A URL de callback no GitHub está configurada como `http://localhost:8000/api/auth/github/callback`
3. O backend está rodando

### Banco de dados com erro

Se houver erro no banco de dados:
1. Delete o arquivo `database.db` (se existir)
2. Reinicie o backend - ele criará um novo banco automaticamente

## 📝 Correções Aplicadas (Versão Atual)

### ✅ Banco de Dados
- Adicionada verificação e criação automática da coluna `avatarUrl`
- Correção do schema do banco de dados
- Tratamento de migração automática

### ✅ OAuth do GitHub
- Corrigida a URL de callback para `/?token=...&userId=...`
- Implementado tratamento de callback na raiz da aplicação
- Adicionados logs detalhados para debug
- Correção do redirecionamento após autenticação

### ✅ OAuth do Google
- Mantida a implementação funcional
- Melhorado tratamento de erros
- Adicionada verificação de avatarUrl

### ✅ Tailwind CSS
- Migrado de Tailwind CSS v4 (experimental) para v3 (estável)
- Adicionado `postcss.config.js`
- Adicionado `tailwindcss-animate` plugin
- Adicionado `autoprefixer`
- Configuradas variáveis CSS para temas
- Corrigida configuração do `tailwind.config.js`
- Adicionadas variáveis CSS customizadas

## 👥 Autores

Projeto desenvolvido como trabalho acadêmico.

## 📄 Licença

Este projeto é de uso acadêmico.

---

**Desenvolvido com ❤️ para o projeto Tech News**
