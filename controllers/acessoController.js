const Acesso = require('../models/Acesso');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

exports.registrarAcesso = async (req, res, next) => { // Adicionado 'next'
    try {
        const { email, senha } = req.body;

        // Obter IP e Nome da Máquina
        // Certifique-se de que o express está configurado para confiar em proxies
        // app.set('trust proxy', true);
        const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const ipLimpo = ip ? ip.replace('::ffff:', '').replace('::1', '127.0.0.1') : 'Desconhecido';
        const maquina = req.headers['user-agent'] || 'Desconhecido';

        // Verifica se o usuário existe
        const usuario = await Usuario.findOne({ email });

        // AQUI ESTÁ A LÓGICA DO MIDDLEWARE:
        // Se o usuário não existir ou a senha for inválida, registramos e ENVIAMOS A RESPOSTA.
        if (!usuario) {
            await Acesso.create({ usuarioId: null, sucesso: false, ip: ipLimpo, maquina }); // Passe IP e Maquina
            return res.status(401).json({ message: '1- Credenciais inválidas.' }); // Resposta ao cliente
        }

        // Verifica a senha (usando senhaHash, como corrigimos no modelo)
        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash); // <-- CORRIGIDO AQUI!
        if (!senhaValida) {
            await Acesso.create({ usuarioId: usuario._id, sucesso: false, ip: ipLimpo, maquina });
            return res.status(401).json({ message: '2- Credenciais inválidas.' }); // Resposta ao cliente
        }

        // Se o acesso for bem-sucedido e as credenciais válidas,
        // registramos o acesso, adicionamos o usuário ao objeto da requisição (para uso futuro)
        // e chamamos next() para passar para o próximo middleware/controlador.
        await Acesso.create({ usuarioId: usuario._id, sucesso: true, ip: ipLimpo, maquina });

        // Opcional: Anexar o usuário à requisição para que os próximos middlewares/controladores possam usá-lo
        req.user = usuario;

        next(); // <--- ESSENCIAL: PASSA O CONTROLE PARA O PRÓXIMO MIDDLEWARE (autenticar_jwt)
    } catch (error) {
        console.error('Erro no middleware registrarAcesso:', error);
        // Em caso de erro interno no middleware, você pode registrar isso também
        // E envia uma resposta de erro para o cliente
        res.status(500).json({ message: 'Erro interno do servidor durante o registro de acesso.', detalhes: error.message });
    }
};

exports.obterAcessos = async (req, res) => {
  try {
    const acessos = await Acesso.find().populate('usuarioId', 'nome email');
    res.json(acessos);
  } catch (error) {
    res.status(400).json({ error: 'Erro ao obter acessos', detalhes: error.message });
  }
};

exports.listarTodosAcessos = async (req, res) => {
    try {
      const acessos = await Acesso.find().populate('usuarioId', 'nome email').sort({ data: -1 });
      res.json(acessos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar acessos', detalhes: error.message });
    }
  };
  
  exports.listarAcessosUsuario = async (req, res) => {
    try {
      const { id } = req.params;
      const acessos = await Acesso.find({ usuarioId: id }).populate('usuarioId', 'nome email').sort({ data: -1 });
      if (!acessos.length) return res.status(404).json({ error: 'Nenhum acesso encontrado para este usuário' });
      res.json(acessos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar acessos do usuário', detalhes: error.message });
    }
  };