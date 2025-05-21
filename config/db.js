require('dotenv').config();
const mongoose = require('mongoose');

const connectDatabase = async () => {
  const dbURL = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Conectado ao banco de dados: ${dbURL}`);
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error.message);
    process.exit(1); // Encerra o processo em caso de falha
  }
};

module.exports = { connectDatabase };