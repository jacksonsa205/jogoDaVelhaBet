const express = require('express');
const router = express.Router();
const path = require('path');

// Rota principal
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// Rota para a página de cadastro
router.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/cadastro.html'));
});

// Página de login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

module.exports = router;
