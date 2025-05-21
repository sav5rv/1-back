// Para garantir que o banco de dados de teste esteja limpo
// antes de cada execução, você pode criar um script no Jest:

const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterEach(async () => {
  // Limpa todas as coleções após cada teste
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
