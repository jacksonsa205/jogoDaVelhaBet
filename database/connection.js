const { Pool } = require('pg');
require('dotenv').config(); // Para carregar variáveis de ambiente

// Configuração do pool de conexões
const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT,
    ssl: {
        rejectUnauthorized: false, // Necessário para Railway
    },
});

// Testa a conexão
pool.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conexão com o banco de dados bem-sucedida!');
    }
});

module.exports = pool;
