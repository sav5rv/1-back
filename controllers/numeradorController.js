require('dotenv').config();
const Numerador = require('../models/Numerador');
const Contador = require('../models/Contador');
// const Usuario = require('../models/Usuario');

// Função para obter e incrementar o número sequencial
async function getNextSequence(collectionName, startValue = 1) {
  const counter = await Contador.findOneAndUpdate(
    { collectionName },
    { $inc: { sequenceValue: 1 } },  
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return counter.sequenceValue || startValue;
};

exports.cadastrarNumerador = async (req, res) => {
  try {
    const numero = await getNextSequence('Numerador', 987 ); // Inicia do 987
    // const usuarioId = usuario._id; //estou usando igual ao acesso, mas o usuario já vai estar logado, pegar o usuario de outra forma
    const { encarregado } = req.body;
    const novoReg = new Numerador({ numero, usuarioId, encarregado });
    await novoReg.save();
    res.status(201).json({ mensagem: 'RSO cadastrado com sucesso!', numerador: novoReg });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao cadastrar RSO', detalhes: err.message });
  }
};

exports.listarNumeradores = async (req, res) => {
  try {
    const numeradores = await Numerador.find();
    // res.status(200).json({ data:numeradores });
    res.status(200).json(numeradores); // <-- esse é o padrão
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao listar RSO', detalhes: err.message });
  }
};

exports.obterNumeradorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const numerador = await Numerador.findById(id);
    if (!numerador) return res.status(404).json({ erro: 'Numero do RSO não encontrado' });
    res.status(200).json(numerador);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao carregar tabela', detalhes: err.message });
  }
};

exports.atualizarNumerador = async (req, res) => {
  try {
    const { id } = req.params;
    const { encarregado } = req.body;
    const numerador = await Numerador.findByIdAndUpdate(
      id,
      { encarregado },
      { new: true, runValidators: true }
    );
    if (!numerador) return res.status(404).json({ erro: 'RSO não encontrado' });
    res.status(200).json({ mensagem: 'Cadastro de RSO atualizado com sucesso!', numerador });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar cadastro de RSO', detalhes: err.message });
  }
};

exports.removerNumerador = async (req, res) => {
  try {
    const { id } = req.params;
    const numerador = await Numerador.findByIdAndDelete(id);
    if (!numerador) return res.status(404).json({ erro: 'Cadastro de RSO não encontrado' });
    res.status(200).json({ mensagem: 'Cadastro de RSO removido com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao remover cadastro de RSO', detalhes: err.message });
  }
};