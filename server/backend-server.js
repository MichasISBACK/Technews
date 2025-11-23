const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const fetch = require('node-fetch');

require("dotenv").config();

const openDb = require("./database");
const { authenticateToken, optionalAuth } = require("./middleware/auth");

const app = express();

// --- Configuração de CORS ---
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5174";
app.use(cors({ 
  origin: FRONTEND_URL, 
  credentials: true,
  optionsSuccessStatus: 200 
}));
app.use(express.json());

// --- Configurações e Variáveis de Ambiente ---
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const PORT = process.env.PORT || 8000;

// Validação de variáveis essenciais
if (!JWT_SECRET) {
  console.error("❌ ERRO CRÍTICO: JWT_SECRET não está definido no arquivo .env");
  process.exit(1);
}

const client = new OAuth2Client(GOOGLE_CLIENT_ID);
let db;

async function initializeDatabaseAndServer() {
  try {
    db = openDb();
    console.log("✅ Conectado ao SQLite!");
    
    // Cria a tabela com todos os campos necessários
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT,
        googleId TEXT UNIQUE,
        githubId TEXT UNIQUE,
        avatarUrl TEXT,
        createdAt DATETIME DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%S', 'now', '-3 hours')),
        loginsThisMonth INTEGER DEFAULT 0,
        articlesRead INTEGER DEFAULT 0,
        onlineTime INTEGER DEFAULT 0,
        yearsActive INTEGER DEFAULT 0,
        lastAccess DATETIME DEFAULT (STRFTIME('%Y-%m-%d %H:%M:%S', 'now', '-3 hours'))
      );
    `);
    
    // Verifica se a coluna avatarUrl existe, se não, adiciona
    try {
      const tableInfo = db.prepare("PRAGMA table_info(users)").all();
      const hasAvatarUrl = tableInfo.some(col => col.name === 'avatarUrl');
      
      if (!hasAvatarUrl) {
        console.log("⚠️  Adicionando coluna avatarUrl à tabela users...");
        db.exec(`ALTER TABLE users ADD COLUMN avatarUrl TEXT`);
        console.log("✅ Coluna avatarUrl adicionada com sucesso!");
      }
    } catch (e) {
      console.log("ℹ️  Tabela users já possui todas as colunas necessárias.");
    }
    
    console.log("✅ Tabela 'users' verificada/criada.");
    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🔗 Frontend permitido (CORS): ${FRONTEND_URL}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 OAuth Google: ${GOOGLE_CLIENT_ID ? 'Configurado ✅' : 'Não configurado ❌'}`);
      console.log(`🔐 OAuth GitHub: ${GITHUB_CLIENT_ID ? 'Configurado ✅' : 'Não configurado ❌'}`);
    });
  } catch (err) {
    console.error("❌ Erro ao inicializar o banco de dados ou servidor:", err);
    process.exit(1);
  }
}

initializeDatabaseAndServer();

// ====================================================================================
// UTILITÁRIOS
// ====================================================================================

/**
 * Gera um token JWT para o usuário
 */
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" }); // Token válido por 7 dias
}

/**
 * Atualiza o último acesso do usuário
 */
function updateLastAccess(userId) {
  db.prepare(`
    UPDATE users 
    SET lastAccess = STRFTIME('%Y-%m-%d %H:%M:%S', 'now', '-3 hours'),
        loginsThisMonth = loginsThisMonth + 1 
    WHERE id = ?
  `).run(userId);
}

/**
 * Remove dados sensíveis do objeto de usuário antes de enviar ao frontend
 */
function sanitizeUser(user) {
  const { passwordHash, ...sanitizedUser } = user;
  return sanitizedUser;
}

// ====================================================================================
// ENDPOINTS DE AUTENTICAÇÃO
// ====================================================================================

/**
 * ENDPOINT: Cadastro de usuário
 */
app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, username, password } = req.body;
  
  try {
    // Validações
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: "A senha deve ter pelo menos 8 caracteres." });
    }
    
    // Verifica se já existe usuário com o mesmo username ou email
    const existingUser = db.prepare(`
      SELECT * FROM users WHERE username = ? OR email = ?
    `).get(username, email);
    
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(409).json({ message: "Nome de usuário já está em uso." });
      }
      if (existingUser.email === email) {
        return res.status(409).json({ message: "Email já está cadastrado." });
      }
    }
    
    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insere o novo usuário
    const result = db.prepare(`
      INSERT INTO users (fullName, email, username, passwordHash) 
      VALUES (?, ?, ?, ?)
    `).run(fullName, email, username, passwordHash);
    
    // Busca o usuário criado
    const newUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(result.lastInsertRowid);
    
    // Gera token
    const token = generateToken(newUser.id);
    
    console.log(`✅ Novo usuário cadastrado: ${username} (ID: ${newUser.id})`);
    
    res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error("❌ Erro no cadastro:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

/**
 * ENDPOINT: Login tradicional
 */
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Busca usuário por username ou email
    const user = db.prepare(`
      SELECT * FROM users WHERE username = ? OR email = ?
    `).get(username, username);
    
    if (!user || !user.passwordHash) {
      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    }
    
    // Verifica a senha
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Usuário ou senha inválidos." });
    }
    
    // Atualiza último acesso
    updateLastAccess(user.id);
    
    // Busca usuário atualizado
    const updatedUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user.id);
    
    // Gera token
    const token = generateToken(user.id);
    
    console.log(`✅ Login bem-sucedido: ${username} (ID: ${user.id})`);
    
    res.status(200).json({
      message: "Login bem-sucedido",
      token,
      user: sanitizeUser(updatedUser)
    });
  } catch (error) {
    console.error("❌ Erro no login:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

/**
 * ENDPOINT: Login com Google OAuth
 */
app.post("/api/auth/google", async (req, res) => {
  const { idToken } = req.body;
  
  try {
    // Verifica o ID Token do Google
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    console.log(`📧 Login Google: ${email}`);
    
    // Busca usuário existente
    let user = db.prepare(`
      SELECT * FROM users WHERE email = ? OR googleId = ?
    `).get(email, googleId);
    
    if (!user) {
      // Cria novo usuário
      const username = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "") + Math.floor(Math.random() * 1000);
      
      const result = db.prepare(`
        INSERT INTO users (fullName, email, username, googleId, passwordHash, avatarUrl) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(name, email, username, googleId, 'oauth_user', picture || null);
      
      user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(result.lastInsertRowid);
      console.log(`✅ Novo usuário Google criado: ${username} (ID: ${user.id})`);
    } else if (!user.googleId) {
      // Vincula Google ID ao usuário existente
      db.prepare(`
        UPDATE users SET googleId = ?, avatarUrl = ? WHERE id = ?
      `).run(googleId, picture || user.avatarUrl, user.id);
      
      user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user.id);
      console.log(`✅ Google ID vinculado ao usuário: ${user.username} (ID: ${user.id})`);
    }
    
    // Atualiza último acesso
    updateLastAccess(user.id);
    
    // Busca usuário atualizado
    const fullUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user.id);
    
    // Gera token
    const token = generateToken(user.id);
    
    res.status(200).json({
      message: "Autenticação Google bem-sucedida",
      token,
      user: sanitizeUser(fullUser)
    });
  } catch (error) {
    console.error("❌ Erro na verificação do ID Token Google:", error);
    res.status(401).json({ message: "ID Token Google inválido ou expirado." });
  }
});

/**
 * ENDPOINT: Iniciar login com GitHub OAuth
 */
app.get("/api/auth/github", (req, res) => {
  if (!GITHUB_CLIENT_ID) {
    return res.status(500).json({ message: "GitHub OAuth não configurado." });
  }
  
  const redirect_uri = `http://localhost:${PORT}/api/auth/github/callback`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=user:email`;
  
  console.log(`🔄 Redirecionando para autenticação GitHub...`);
  console.log(`📍 Callback URL: ${redirect_uri}`);
  res.redirect(githubAuthUrl);
});

/**
 * ENDPOINT: Callback do GitHub OAuth
 */
app.get("/api/auth/github/callback", async (req, res) => {
  const { code } = req.query;
  
  if (!code) {
    console.error("❌ Callback do GitHub sem código de autorização");
    return res.redirect(`${FRONTEND_URL}/?error=github_no_code`);
  }
  
  try {
    console.log(`🔑 Código de autorização recebido do GitHub`);
    
    // Troca o código por um access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code
      }),
    });
    
    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      throw new Error(tokenData.error_description || "Erro ao obter token de acesso do GitHub.");
    }
    
    const accessToken = tokenData.access_token;
    console.log(`✅ Access token obtido do GitHub`);
    
    // Busca dados do usuário no GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });
    
    const githubUser = await userResponse.json();
    const { id: githubId, name, login, email: githubEmail, avatar_url } = githubUser;
    
    // Se o email não estiver público, busca os emails do usuário
    let primaryEmail = githubEmail;
    if (!primaryEmail) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: { "Authorization": `Bearer ${accessToken}` }
      });
      const emails = await emailsResponse.json();
      const primaryEmailObj = emails.find(e => e.primary) || emails[0];
      primaryEmail = primaryEmailObj ? primaryEmailObj.email : `${login}@github.provider`;
    }
    
    console.log(`📧 Login GitHub: ${primaryEmail}`);
    
    // Busca usuário existente
    let user = db.prepare(`
      SELECT * FROM users WHERE email = ? OR githubId = ?
    `).get(primaryEmail, githubId.toString());
    
    if (!user) {
      // Cria novo usuário
      const result = db.prepare(`
        INSERT INTO users (fullName, email, username, githubId, passwordHash, avatarUrl) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        name || login,
        primaryEmail,
        login,
        githubId.toString(),
        'oauth_user',
        avatar_url || null
      );
      
      user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(result.lastInsertRowid);
      console.log(`✅ Novo usuário GitHub criado: ${login} (ID: ${user.id})`);
    } else if (!user.githubId) {
      // Vincula GitHub ID ao usuário existente
      db.prepare(`
        UPDATE users SET githubId = ?, avatarUrl = ? WHERE id = ?
      `).run(githubId.toString(), avatar_url || user.avatarUrl, user.id);
      
      user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user.id);
      console.log(`✅ GitHub ID vinculado ao usuário: ${user.username} (ID: ${user.id})`);
    }
    
    // Atualiza último acesso
    updateLastAccess(user.id);
    
    // Busca usuário atualizado
    const fullUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(user.id);
    
    // Gera token
    const token = generateToken(user.id);
    
    // Redireciona para o frontend com o token
    console.log(`✅ Redirecionando para o frontend com token`);
    res.redirect(`${FRONTEND_URL}/?token=${token}&userId=${user.id}`);
  } catch (error) {
    console.error("❌ Erro no callback do GitHub:", error);
    res.redirect(`${FRONTEND_URL}/?error=github_failed`);
  }
});

// ====================================================================================
// ENDPOINTS DE DADOS (NOTÍCIAS, CLIMA, ETC.)
// ====================================================================================

/**
 * ENDPOINT: Listar notícias com filtros
 */
app.get("/api/news", optionalAuth, async (req, res) => {
  try {
    const { search, limit = 13 } = req.query;
    let articles = [];

    if (!GNEWS_API_KEY && !NEWSAPI_KEY) {
      return res.status(500).json({
        message: "APIs de notícias não configuradas no arquivo .env do backend."
      });
    }

    // Função para formatar os artigos e adicionar dados extras
    const formatArticle = (article, sourceName) => {
      const views = Math.floor(Math.random() * 10000) + 500;
      const readTime = Math.ceil((article.description?.length || 200) / 250);

      return {
        title: article.title,
        summary: article.description,
        image: article.image || article.urlToImage,
        url: article.url,
        source: article.source?.name || sourceName,
        date: article.publishedAt,
        author: article.author || article.source?.name || "Redação",
        views: views.toLocaleString('pt-BR'),
        readTime: `${readTime} min`,
      };
    };

    // Tenta buscar da GNews API
    if (GNEWS_API_KEY) {
      let gnewsQuery = search ? search : 'tecnologia OR "inteligência artificial" OR software';
      let gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(gnewsQuery)}&lang=pt&country=br&max=${limit}&apikey=${GNEWS_API_KEY}`;
      
      try {
        const gnewsResponse = await fetch(gnewsUrl);
        if (gnewsResponse.ok) {
          const gnewsData = await gnewsResponse.json();
          if (gnewsData.articles) {
            articles = gnewsData.articles
              .filter(a => a.image && a.description)
              .map(a => formatArticle(a, "GNews"));
          }
        } else {
          console.error("Erro na GNews API:", await gnewsResponse.text());
        }
      } catch (e) {
        console.error("Falha ao contatar GNews API:", e);
      }
    }

    // Se a GNews falhar ou não retornar artigos suficientes, complementa com a NewsAPI
    if (articles.length < limit && NEWSAPI_KEY) {
      const remainingLimit = limit - articles.length;
      let newsApiQuery = search ? search : 'tecnologia OR apple OR google OR microsoft';
      let newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(newsApiQuery)}&language=pt&sortBy=publishedAt&pageSize=${remainingLimit}&apiKey=${NEWSAPI_KEY}`;
      
      try {
        const newsApiResponse = await fetch(newsApiUrl);
        if (newsApiResponse.ok) {
          const newsApiData = await newsApiResponse.json();
          if (newsApiData.articles) {
            const newsApiArticles = newsApiData.articles
              .filter(a => a.urlToImage && a.description)
              .map(a => formatArticle(a, "NewsAPI"));
            articles = [...articles, ...newsApiArticles];
          }
        } else {
          console.error("Erro na NewsAPI:", await newsApiResponse.text());
        }
      } catch (e) {
        console.error("Falha ao contatar NewsAPI:", e);
      }
    }

    // Remove duplicados baseados no título
    const uniqueArticles = Array.from(
      new Set(articles.map(a => a.title))
    ).map(title => articles.find(a => a.title === title));
    
    const finalArticles = uniqueArticles.slice(0, limit);

    console.log(`✅ Notícias: Retornando ${finalArticles.length} artigos formatados.`);
    res.json({ news: finalArticles, total: finalArticles.length });
  } catch (error) {
    console.error("❌ Erro geral ao buscar notícias:", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar notícias." });
  }
});

/**
 * ENDPOINT: Obter categorias disponíveis
 */
app.get("/api/news/categories", (req, res) => {
  res.json([
    { id: 'all', name: 'Todas' },
    { id: 'tech', name: 'Tecnologia' },
    { id: 'ai', name: 'I.A.' },
    { id: 'space', name: 'Espaço' },
  ]);
});

/**
 * ENDPOINT: Obter dados de clima
 */
app.get("/api/weather", optionalAuth, async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ message: "Latitude e longitude são obrigatórias." });
    }
    
    if (!OPENWEATHER_API_KEY) {
      return res.status(500).json({ message: "API de clima não configurada no .env do backend." });
    }
    
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`;
    const weatherResponse = await fetch(weatherUrl);
    
    if (!weatherResponse.ok) {
      console.error("Erro na API de clima:", await weatherResponse.text());
      throw new Error(`Erro na API de clima.`);
    }
    
    const weatherData = await weatherResponse.json();
    const formattedWeather = {
      temperature: Math.round(weatherData.main.temp),
      description: weatherData.weather[0].description,
      city: weatherData.name,
    };
    
    res.json(formattedWeather);
  } catch (error) {
    console.error("❌ Erro no endpoint de clima:", error);
    res.status(500).json({ message: "Erro interno do servidor ao buscar clima." });
  }
});

// ====================================================================================
// ENDPOINTS DE USUÁRIO
// ====================================================================================

/**
 * ENDPOINT: Obter dados de um usuário específico (protegido)
 */
app.get("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verifica se o usuário está tentando acessar seus próprios dados
    if (parseInt(id) !== req.userId) {
      return res.status(403).json({ message: "Acesso negado." });
    }
    
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
    
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    
    res.json(sanitizeUser(user));
  } catch (error) {
    console.error("❌ Erro ao obter dados do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

/**
 * ENDPOINT: Atualizar dados do usuário (protegido)
 */
app.put("/api/users/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, username } = req.body;
    
    // Verifica se o usuário está tentando atualizar seus próprios dados
    if (parseInt(id) !== req.userId) {
      return res.status(403).json({ message: "Acesso negado." });
    }
    
    // Verifica se o usuário existe
    const user = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    
    // Atualiza os dados
    const updates = [];
    const values = [];
    
    if (fullName && fullName !== user.fullName) {
      updates.push("fullName = ?");
      values.push(fullName);
    }
    
    if (email && email !== user.email) {
      // Verifica se o email já está em uso
      const existingEmail = db.prepare(`SELECT id FROM users WHERE email = ? AND id != ?`).get(email, id);
      if (existingEmail) {
        return res.status(409).json({ message: "Email já está em uso." });
      }
      updates.push("email = ?");
      values.push(email);
    }
    
    if (username && username !== user.username) {
      // Verifica se o username já está em uso
      const existingUsername = db.prepare(`SELECT id FROM users WHERE username = ? AND id != ?`).get(username, id);
      if (existingUsername) {
        return res.status(409).json({ message: "Nome de usuário já está em uso." });
      }
      updates.push("username = ?");
      values.push(username);
    }
    
    if (updates.length > 0) {
      values.push(id);
      db.prepare(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`).run(...values);
      console.log(`✅ Usuário atualizado: ID ${id}`);
    }
    
    // Retorna usuário atualizado
    const updatedUser = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
    res.json(sanitizeUser(updatedUser));
  } catch (error) {
    console.error("❌ Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

// ====================================================================================
// ENDPOINTS DE SISTEMA
// ====================================================================================

/**
 * ENDPOINT: Verificar saúde do servidor
 */
app.get("/api/health", async (req, res) => {
  try {
    const result = db.prepare(`SELECT COUNT(*) as totalUsers FROM users`).get();
    res.json({
      status: "OK",
      message: "Servidor de autenticação funcionando!",
      timestamp: new Date().toISOString(),
      totalUsers: result.totalUsers,
      services: {
        database: "OK",
        googleOAuth: GOOGLE_CLIENT_ID ? "Configurado" : "Não configurado",
        githubOAuth: GITHUB_CLIENT_ID ? "Configurado" : "Não configurado",
        newsApis: (GNEWS_API_KEY || NEWSAPI_KEY) ? "Configurado" : "Não configurado",
        weatherApi: OPENWEATHER_API_KEY ? "Configurado" : "Não configurado"
      }
    });
  } catch (error) {
    console.error("❌ Erro no health check:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
});

/**
 * Tratamento de rotas não encontradas
 */
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint não encontrado." });
});

/**
 * Tratamento de erros global
 */
app.use((err, req, res, next) => {
  console.error("❌ Erro não tratado:", err);
  res.status(500).json({ message: "Erro interno do servidor." });
});
