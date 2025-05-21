require('dotenv').config();
const Usuario = require('../models/Usuario');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Verificar se o usuário existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(401).json({ message: 'A- Usuário ou Senha inválida.' });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaValida) {
            return res.status(401).json({ message: 'B- Usuário ou Senha inválida.' });
        }

        // 3. Gerar token JWT
        // Garanta que process.env.SECRET_KEY esteja definido no seu arquivo .env
        if (!process.env.SECRET_KEY) {
            console.error('Erro: Variável de ambiente SECRET_KEY não definida.');
            return res.status(500).json({ message: 'Erro de configuração do servidor.' });
        }

        const token = jwt.sign({ id: usuario._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // 4. Resposta de sucesso
        res.json({ token, message: 'Login bem-sucedido.' });

    } catch (err) {
        console.error('Erro ao logar o usuário:', err);
        res.status(500).json({ message: 'Erro interno do servidor ao realizar login.', erro: err.message });
    }
};


exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // **Validação básica (opcional, mas altamente recomendada)**
    // Verifique se todos os campos necessários foram fornecidos
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Por favor, forneça nome, email e senha.' });
    }

    // **Verificar se o usuário já existe (opcional, mas altamente recomendada)**
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Este email já está cadastrado.' });
    }

    console.log('Dados recebidos:', req.body);
    console.log('Senha recebida:', senha);

    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    console.log('senhaHash', senhaHash);

    const novoUsuario = new Usuario({ nome, email, senhaHash });
    console.log('Novo usuário:', novoUsuario);

    await novoUsuario.save();

    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', usuario: novoUsuario });
  } catch (err) {
    // Melhor tratamento de erro: logar o erro completo no console para depuração
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ erro: 'Erro interno do servidor ao cadastrar usuário', detalhes: err.message });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    // res.status(200).json({ data:usuarios });
    res.status(200).json(usuarios); // <-- esse é o padrão
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao listar usuários', detalhes: err.message });
  }
};

exports.obterUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.status(200).json(usuario);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao obter usuário', detalhes: err.message });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;
    const usuario = await Usuario.findByIdAndUpdate(
      id,
      { nome, email, senha },
      { new: true, runValidators: true }
    );
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.status(200).json({ message: 'Usuário atualizado com sucesso!', usuario });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar usuário', detalhes: err.message });
  }
};

exports.removerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndDelete(id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.status(200).json({ message: 'Usuário removido com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao remover usuário', detalhes: err.message });
  }
};

exports.trocarSenha = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) return res.status(400).json({ erro: 'Senha atual incorreta' });

    const senhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);
    usuario.senha = senhaHash;
    await usuario.save();
    return res.json({ message: 'Senha alterada com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao trocar senha', detalhes: err.message });
  }
};

exports.recuperarSenha = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    // Gerar o token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Simulando envio de email
    // console.log(`Link para redefinir senha: http://localhost:3000/usuarios/redefinir-senha/${token}`);

    // Configurar o transporte de e-mail
      const transporter = nodemailer.createTransport({
      service: 'yahoo', // gmail é o mais fácil
      auth: {
        user: process.env.SMTP_USER, // Seu e-mail
        pass: process.env.SMTP_PASS, // Sua senha ou App Password
      },
    });

    // Criar o link de redefinição de senha
    const frontendBaseUrl = 'http://127.0.0.1:5500'; // pode ser https://seudominio.com em produção
    const link = `${frontendBaseUrl}/redefinir.html?token=${token}`;

    // Configurar o e-mail
    const mailOptions = {
      from: process.env.SMTP_USER, // Remetente
      to: email, //Destinatário
      //to: 'fidorid914@gholar.com',
      subject: 'Recuperação de Senha',
      html: `<p>Olá,</p>
              <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir:</p>
              <a href="${link}">${link}</a>
              <p>Este link é válido por 1 hora.</p>`,
    };

    // Enviar o e-mail
    await transporter.sendMail(mailOptions);

    res.json({ message: 'E-mail de recuperação enviado com sucesso!' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao iniciar recuperação de senha', detalhes: err.message });
  }
};

exports.redefinirSenha = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Pega o token após "Bearer"
    const { novaSenha } = req.body;

    // 1. Validação dos dados
    if (!token || !novaSenha) {
      return res.status(400).json({ erro: 'Token e nova senha são obrigatórios' });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
    }

    // 2. Verificar e decodificar o token
    let payload;
    try {
      payload = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }

    // 3. Buscar o usuário
    const usuario = await Usuario.findById(payload.id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    // 4. Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, SALT_ROUNDS);

    // 5. Atualizar e salvar
    usuario.senha = senhaHash;
    await usuario.save();
    return res.json({ message: 'Senha redefinida com sucesso!' });

  } catch (err) {
    console.error('Erro ao redefinir senha:', err);
    res.status(500).json({ erro: 'Erro interno no servidor', detalhes: err.message });
  }
};


exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(200).json({ existe: true });
    } else {
      return res.status(404).json({ existe: false });
    }
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao verificar e-mail', detalhes: err.message });
  }
};
