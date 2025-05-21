const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar o token JWT em rotas protegidas.
 */
const autenticar = (req, res, next) => {
  // Captura o token do cabeçalho da requisição
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ erro: 'Token de autenticação não fornecido' });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.usuarioId = decoded.id; // Adiciona o ID do usuário ao objeto req
    next(); // Prossegue para o próximo middleware ou controlador
  } catch (err) {
    res.status(403).json({ erro: 'Token inválido ou expirado', detalhes: err.message });
  }
};

module.exports = autenticar;
