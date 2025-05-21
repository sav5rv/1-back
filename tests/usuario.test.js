const request = require('supertest');
const app = require('../server'); // Importa o app do servidor
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

// Configurações globais de teste
beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Testes para a API de Usuários', () => {
  let userId;

  test('Deve criar um novo usuário', async () => {
    const response = await request(app).post('/').send({
      nome: 'Teste',
      email: 'teste@example.com',
      senha: 'senha123',
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    userId = response.body.id;
  });

  test('Deve fazer login com sucesso', async () => {
    const response = await request(app).post('/usuarios/login').send({
      email: 'teste@example.com',
      senha: 'senha123',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('Deve falhar ao tentar redefinir senha de um e-mail inexistente', async () => {
    const response = await request(app).post('/usuarios/recuperar-senha').send({
      email: 'inexistente@example.com',
    });
    expect(response.statusCode).toBe(404);
  });

  afterAll(async () => {
    await Usuario.findByIdAndDelete(userId); // Limpa o usuário criado
  });
});
