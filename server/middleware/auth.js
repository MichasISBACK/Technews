const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware para verificar o token JWT nas requisições
 * Adiciona o userId decodificado ao objeto req para uso nos endpoints
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: "Token de autenticação não fornecido." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token inválido ou expirado." });
    }
    
    req.userId = decoded.userId;
    next();
  });
};

/**
 * Middleware opcional - não retorna erro se o token não existir
 * Útil para endpoints que funcionam com ou sem autenticação
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) {
        req.userId = decoded.userId;
      }
    });
  }
  
  next();
};

module.exports = {
  authenticateToken,
  optionalAuth
};
