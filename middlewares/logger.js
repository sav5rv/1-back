// middlewares/logger.js

const logger = (req, res, next) => {
    const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    const log = `[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`;
    console.log(log);
    next();
  };
  
  module.exports = logger;
  