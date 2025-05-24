require('dotenv').config();
const Patio = require('../models/Patio');
const Contador = require('../models/Contador');
// const Usuario = require('../models/Usuario');

// Função para obter e incrementar o número sequencial
async function getNextSequence(collectionName) {
  const counter = await Contador.findOneAndUpdate(
    { collectionName },
    { $inc: { sequenceValue: 1 } },  
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  // Se um novo contador foi criado, usa o valor inicial correto
  if (!counter || !counter.sequenceValue) {
    await Contador.updateOne(
      { collectionName },
      { $set: { sequenceValue: 1 } },
      { upsert: true }
    );
    return 1;
}
  return counter.sequenceValue;
};

  // função para listar todos os contadores
exports.listarContadores = async (req, res) => {
  try {
    const contadores = await Contador.find({}, 'collectionName sequenceValue -_id'); // Apenas os campos necessários
    res.status(200).json(contadores);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar contadores', detalhes: error.message });
  }
};




// Função para redefinir o contador
exports.resetCounter = async (req, res) => {
  try {
    const { collectionName, novoValorInicioContador } = req.body;

    if (!collectionName || !Number.isInteger(novoValorInicioContador) || novoValorInicioContador < 1) {
      return res.status(400).json({ erro: 'Dados inválidos. Informe collectionName e um número inteiro positivo.' });
    }

    const updatedCounter = await Contador.findOneAndUpdate(
      { collectionName },
      { $set: { sequenceValue: novoValorInicioContador } },
      { new: true, upsert: true }
    );

    res.json({ message: `Contador de ${collectionName} redefinido com sucesso`, updatedCounter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.cadastrarPatio = async (req, res) => {
  try {
    const numero = await getNextSequence('Patio'); // Obtém o próximo número sequencial automaticamente

    // const usuarioId = req.user ? req.user._id : null; // Se req.user contém o ID do usuário logado, modifique assim Ajustar a obtenção do usuário logado
    const { eventoDER, numRv, situacao, dtRecolha, localPatioRecolha, numBO, marca, modelo, placa, msg, dtMovimentacao } = req.body;

    const novoReg = new Patio({ 
      numero, 
      usuarioId, 
      eventoDER, 
      numRv, 
      situacao, 
      dtRecolha, 
      localPatioRecolha, 
      numBO, 
      marca, 
      modelo, 
      placa, 
      msg, 
      dtMovimentacao 
    });

    await novoReg.save();
    res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', patio: novoReg });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar usuário', detalhes: err.message });
  }
};


exports.listarPatios = async (req, res) => {
  try {
    const patios = await Patio.find();
    // res.status(200).json({ data:patios });
    res.status(200).json(patios); // <-- esse é o padrão
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao listar patios', detalhes: err.message });
  }
};

exports.obterPatioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const patio = await Patio.findById(id);
    if (!patio) return res.status(404).json({ erro: 'Patio não encontrado' });
    res.status(200).json(patio);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao obter patio', detalhes: err.message });
  }
};

exports.atualizarPatio = async (req, res) => {
  try {
    const { id } = req.params;
    const { eventoDER, numRv, situacao, dtRecolha, localPatioRecolha, numBO, marca, modelo, placa, msg, dtMovimentacao } = req.body;
    const patio = await Patio.findByIdAndUpdate(
      id,
      { eventoDER, numRv, situacao, dtRecolha, localPatioRecolha, numBO, marca, modelo, placa, msg, dtMovimentacao },
      { new: true, runValidators: true }
    );
    if (!patio) return res.status(404).json({ erro: 'Patio não encontrado' });
    res.status(200).json({ mensagem: 'Cadastro de patio atualizado com sucesso!', patio });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar cadastro de patio', detalhes: err.message });
  }
};

exports.removerPatio = async (req, res) => {
  try {
    const { id } = req.params;
    const patio = await Patio.findByIdAndDelete(id);
    if (!patio) return res.status(404).json({ erro: 'Cadastro de Patio não encontrado' });
    res.status(200).json({ mensagem: 'Cadastro de Patio removido com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao remover cadastro de Patio', detalhes: err.message });
  }
};