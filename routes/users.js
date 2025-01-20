const express = require('express');
const router = express.Router();
const pool = require('../database/connection'); // Importa o pool de conexões

// Rota para consultar todos os usuários
router.get('/consulta-users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users;');
        res.status(200).json({ message: 'Usuários encontrados com sucesso!', data: result.rows });
    } catch (err) {
        console.error('Erro ao consultar usuários:', err);
        res.status(500).json({ error: 'Erro ao consultar usuários.' });
    }
});

// Rota para cadastrar um novo usuário
router.post('/cadastra-users', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica se o email já existe
        const emailCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (emailCheck.rowCount > 0) {
            return res.status(400).json({ error: 'O email já está cadastrado. Por favor, use outro email.' });
        }

        // Insere o novo usuário
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', data: result.rows[0] });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
    }
});


module.exports = router;
