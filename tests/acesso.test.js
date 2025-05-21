const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server'); // Importa o app do servidor
const mongoose = require('mongoose');
const Acesso = require('../models/Acesso');

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DATABASE_URL);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Testes para a API de Acessos', () => {
  let acessoId;

  // Gere um token válido para o teste
  const token = jwt.sign({ id: 'usuarioTesteId' }, process.env.SECRET_KEY, { expiresIn: '1h' });

  test('Deve registrar um acesso com sucesso', async () => {
    const response = await request(app)
      .post('/acessos/registrar').send({
        usuarioId: '64c0b1d4e4f7a2b6a22d8e67',
        status: 'sucesso',
        ip: '192.168.0.1',
        nomeMaquina: 'PC-Teste',
    }).set('Authorization', `Bearer ${token}`);
    
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    acessoId = response.body.id;
  });

  test('Deve listar todos os acessos', async () => {
    const response = await request(app)
        .get('/acessos/listar-todos-acessos')
        .set('Authorization', `Bearer ${token}`); // Adiciona o token ao header

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Deve listar acessos de um usuário específico', async () => {
    const response = await request(app)
      .get('/acessos/listar-acesso/64c0b1d4e4f7a2b6a22d8e67')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  afterAll(async () => {
    await Acesso.findByIdAndDelete(acessoId); // Limpa o acesso criado
  });
});
