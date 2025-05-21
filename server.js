//require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();

const db = require('./config/db');
const app = require('./config/app');

//chama a função que está em /config/db para conectar ao Bc Dados
db.connectDatabase();

// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  }
