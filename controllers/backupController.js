const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '../.env' }) //o arquivo .js não está na mesma pasta que o .env

// Configurações
//const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
//const DATABASE_NAME = 'accessControl';
const BACKUP_DIR = path.join(__dirname, '../backups');
const SMTP_ADMIN = process.env.SMTP_ADMIN || 'admin@example.com';

// Função para enviar notificações por email
async function sendNotification(subject, message) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: SMTP_ADMIN,
            subject,
            text: message,
        });

        console.log('Notificação enviada:', subject);
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
    }
}

// Função para criar backup
async function createBackup(format = 'json') {
    try {
        const client = new MongoClient(process.env.DATABASE_BCK);
        await client.connect();
        const db = client.db(process.env.DATABASE_NAME);

        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR);
        }

        const collections = await db.listCollections().toArray();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

        for (const collection of collections) {
            const collectionName = collection.name;
            const data = await db.collection(collectionName).find().toArray();
            const fileName = `${collectionName}-${timestamp}.${format}`;
            const filePath = path.join(BACKUP_DIR, fileName);

            if (format === 'json') {
                await fs.writeFile(filePath, JSON.stringify(data, null, 2));
            } else if (format === 'csv') {
                const csvData = data.map(doc => Object.values(doc).join(',')).join('\n');
                await fs.writeFile(filePath, csvData);
            }

            console.log(`Backup da coleção "${collectionName}" criado em ${filePath}`);
        }

        await client.close();
    } catch (error) {
        console.error('Erro ao criar backup:', error);
        await sendNotification('Falha no Backup', `Erro ao criar backup: ${error.message}`);
    }
}

// Função para listar backups
function listBackups() {
    if (!fs.existsSync(BACKUP_DIR)) {
        return [];
    }
    return fs.readdirSync(BACKUP_DIR).map(file => ({
        fileName: file,
        filePath: path.join(BACKUP_DIR, file),
    }));
}

// Função para deletar um backup
function deleteBackup(fileName) {
    const filePath = path.join(BACKUP_DIR, fileName);
    if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
        console.log(`Backup "${fileName}" deletado com sucesso.`);
        return true;
    }
    return false;
}

// Função para agendar backups
function scheduleBackup(cronExpression = '0 0 * * 0', format = 'json') {
    cron.schedule(cronExpression, () => {
        console.log('Iniciando processo de backup...');
        createBackup(format);
    });
    console.log('Backup agendado com sucesso.');
}

module.exports = { createBackup, scheduleBackup, listBackups, deleteBackup };
