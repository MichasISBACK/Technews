# Guia de Instalação - Tech News

Este guia fornece instruções passo a passo para configurar e executar o projeto Tech News no seu computador usando o Visual Studio Code.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (versão 18 ou superior)
   - Baixe em: https://nodejs.org/
   - Verifique a instalação: `node --version`

2. **Visual Studio Code**
   - Baixe em: https://code.visualstudio.com/

3. **Git** (opcional, mas recomendado)
   - Baixe em: https://git-scm.com/

## Passo a Passo de Instalação

### 1. Extrair o Projeto

1. Localize o arquivo `technews_final.zip` que você recebeu.
2. Extraia o conteúdo para uma pasta de sua preferência (ex: `C:\Projetos\technews` ou `~/Projetos/technews`).
3. Você verá uma pasta chamada `tela` dentro da pasta extraída.

### 2. Abrir o Projeto no VS Code

1. Abra o Visual Studio Code.
2. Clique em **File > Open Folder** (ou **Arquivo > Abrir Pasta**).
3. Navegue até a pasta `tela` que você extraiu e selecione-a.
4. Clique em **Selecionar Pasta** (ou **Select Folder**).

### 3. Instalar as Dependências

1. No VS Code, abra o terminal integrado:
   - Use o atalho **Ctrl + `** (ou **Cmd + `** no Mac)
   - Ou vá em **Terminal > New Terminal** (ou **Terminal > Novo Terminal**)

2. No terminal, execute o seguinte comando para instalar todas as dependências:
   ```bash
   npm install
   ```

   **Nota:** Se você tiver o `pnpm` instalado, pode usar `pnpm install` para uma instalação mais rápida.

3. Aguarde a instalação ser concluída. Isso pode levar alguns minutos.

### 4. Configurar as Variáveis de Ambiente

O arquivo `.env` já está configurado com as chaves de API necessárias para o projeto funcionar. **Não é necessário fazer alterações** para testar o projeto.

**Importante:** O arquivo `.env` contém informações sensíveis. Em produção, você deve:
- Gerar suas próprias chaves de API.
- Nunca compartilhar o arquivo `.env` publicamente.
- Usar o arquivo `.env.example` como referência.

### 5. Executar o Projeto

Para executar o projeto, você precisa iniciar tanto o **frontend** quanto o **backend** simultaneamente.

#### Opção 1: Executar Frontend e Backend Juntos (Recomendado)

No terminal do VS Code, execute:
```bash
npm run dev:all
```

Isso iniciará:
- **Frontend** em `http://localhost:5174`
- **Backend** em `http://localhost:8000`

#### Opção 2: Executar Frontend e Backend Separadamente

Se preferir executar em terminais separados:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:backend
```

### 6. Acessar a Aplicação

1. Abra seu navegador (Chrome, Firefox, Edge, etc.).
2. Acesse: `http://localhost:5174`
3. Você verá a tela de login do Tech News.

### 7. Testar a Aplicação

#### Criar uma Conta

1. Na tela de login, clique em **"Não tem uma conta? Cadastre-se"**.
2. Preencha os campos:
   - Nome Completo
   - Email
   - Nome de Usuário
   - Senha (mínimo 8 caracteres)
   - Confirmar Senha
3. Clique em **"Criar Conta"**.
4. Você será automaticamente logado.

#### Fazer Login com Google

1. Na tela de login, clique no botão **"Continuar com Google"**.
2. Selecione sua conta Google.
3. Autorize o acesso.
4. Você será automaticamente logado.

#### Fazer Login com GitHub

1. Na tela de login, clique no botão **"Continuar com GitHub"**.
2. Você será redirecionado para o GitHub.
3. Autorize o acesso à aplicação "newsTech".
4. Você será redirecionado de volta e automaticamente logado.

#### Explorar a Aplicação

Após fazer login, você pode:
- Ver notícias de tecnologia na página principal.
- Clicar em uma notícia para abri-la em uma nova aba.
- Acessar seu perfil clicando no ícone de usuário na sidebar.
- Explorar as configurações, notificações e favoritos.

## Solução de Problemas

### Erro: "Port 5174 is already in use"

Se a porta 5174 já estiver em uso, você pode:
1. Fechar o processo que está usando a porta.
2. Ou alterar a porta no arquivo `vite.config.js`:
   ```javascript
   server: {
     port: 5175, // Altere para outra porta
   }
   ```

### Erro: "Port 8000 is already in use"

Se a porta 8000 já estiver em uso, você pode:
1. Fechar o processo que está usando a porta.
2. Ou alterar a porta no arquivo `.env`:
   ```
   PORT=8001
   ```

### Erro ao Instalar Dependências

Se você encontrar erros ao executar `npm install`:
1. Certifique-se de que o Node.js está instalado corretamente.
2. Tente limpar o cache do npm:
   ```bash
   npm cache clean --force
   ```
3. Tente novamente:
   ```bash
   npm install
   ```

### OAuth do GitHub Não Funciona

O OAuth do GitHub está configurado para funcionar em `http://localhost:5174`. Se você alterar a porta do frontend, precisará:
1. Atualizar a URL de callback no GitHub Developer Settings.
2. Atualizar o arquivo `.env` com as novas configurações.

### Notícias Não Carregam

Se as notícias não carregarem:
1. Verifique se o backend está rodando (`http://localhost:8000`).
2. Verifique se as chaves de API no arquivo `.env` estão corretas.
3. Verifique o console do navegador (F12) para ver erros.

## Estrutura de Pastas

```
tela/
├── src/                    # Código-fonte do frontend
│   ├── components/         # Componentes React
│   ├── config/             # Configurações
│   ├── constants/          # Constantes
│   ├── hooks/              # Hooks customizados
│   ├── services/           # Serviços de API
│   ├── utils/              # Utilitários
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Ponto de entrada
├── middleware/             # Middlewares do backend
├── backend-server.js       # Servidor Express
├── database.js             # Configuração do banco de dados
├── .env                    # Variáveis de ambiente
├── package.json            # Dependências
└── README.md               # Documentação
```

## Comandos Úteis

- `npm run dev` - Inicia o frontend
- `npm run dev:backend` - Inicia o backend
- `npm run dev:all` - Inicia frontend e backend
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a build de produção

## Melhorias Implementadas

Este projeto foi refatorado com as seguintes melhorias:

### Autenticação
- ✅ OAuth do GitHub implementado e funcional
- ✅ OAuth do Google mantido e melhorado
- ✅ Sistema de JWT com tokens de 7 dias de validade
- ✅ Middleware de autenticação no backend
- ✅ Persistência de sessão no localStorage
- ✅ Verificação automática de token expirado

### Escalabilidade
- ✅ Serviços centralizados (authService, newsService, weatherService)
- ✅ Configuração centralizada de API
- ✅ Constantes do projeto organizadas
- ✅ Hooks customizados reutilizáveis
- ✅ Utilitários de formatação
- ✅ Estrutura de pastas organizada

### Segurança
- ✅ Senhas hasheadas com bcrypt
- ✅ Tokens JWT assinados
- ✅ Validação de dados no backend
- ✅ Sanitização de dados do usuário
- ✅ CORS configurado corretamente
- ✅ Variáveis de ambiente protegidas

### Experiência do Usuário
- ✅ Loading states durante autenticação
- ✅ Mensagens de erro claras
- ✅ Validação de formulários
- ✅ Feedback visual em todas as ações
- ✅ Responsividade mantida

## Suporte

Se você encontrar problemas ou tiver dúvidas:
1. Verifique a seção de **Solução de Problemas** acima.
2. Consulte o arquivo `README.md` para mais informações.
3. Entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ para o projeto Tech News**
