const mongoose = require('mongoose');

// Não precisamos de uma função de fuso horário aqui para salvar.
// O Mongoose e o MongoDB gerenciam isso em UTC por padrão.

const acessoSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: false // Se for true, não poderá registrar acesso de usuário não encontrado
  },
  // O campo 'data' (poderia ser 'dataAcesso')
  // Por padrão, Date.now() retorna a data atual do servidor.
  // O Mongoose converte isso para UTC antes de salvar no MongoDB.
  data: {
    type: Date,
    default: Date.now
  },
  sucesso: {
    type: Boolean,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  maquina: {
    type: String,
    required: true
  },
}, {
  // timestamps do Mongoose são a melhor forma de gerenciar datas de criação/atualização.
  // Eles também armazenam em UTC por padrão.
  timestamps: {
    createdAt: 'criadoEm', // Renomeia o campo padrão 'createdAt' para 'criadoEm'
    updatedAt: 'atualizadoEm' // Renomeia o campo padrão 'updatedAt' para 'atualizadoEm'
    // Não use 'currentTime' com uma função personalizada para fusos horários.
    // Deixe o Mongoose lidar com a data/hora do servidor em UTC.
  }
});

// É uma boa prática adicionar métodos ou virtuals para formatar a data
// APÓS a recuperação do banco de dados, não antes de salvar.

// Exemplo de um "virtual" (campo que não é salvo no DB, mas é calculado dinamicamente)
// para obter a data formatada no fuso horário de São Paulo.
acessoSchema.virtual('dataHoraBrasil').get(function() {
  if (this.data) { // Verifica se a data existe
    const dataUTC = new Date(this.data); // Pega a data armazenada em UTC
    const offsetSaoPaulo = -3 * 60; // Offset em minutos para UTC-3
    // Calcula a data no fuso horário de São Paulo
    const dataSaoPaulo = new Date(dataUTC.getTime() + (offsetSaoPaulo + dataUTC.getTimezoneOffset()) * 60 * 1000);

    // Formata para o padrão DD/MM/YYYY HH:mm:ss
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Formato 24 horas
      timeZone: 'America/Sao_Paulo' // Ou defina diretamente o fuso horário para garantir
    };
    return dataSaoPaulo.toLocaleString('pt-BR', options);
  }
  return null;
});


module.exports = mongoose.model('Acesso', acessoSchema);
