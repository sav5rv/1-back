//require('dotenv').config();
const dotenv = require('dotenv');
dotenv.config();


const app = require('./config/app.js');
const mongoose = require('./config/db.js');

//chama a função que está em /config/db para conectar ao Bc Dados
app();
mongoose();


// Iniciar servidor
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Acessar http://localhost:${PORT}`);    
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

