const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const { Server } = require('socket.io');
const http = require('http');
const usersRouter = require('./routes/users'); // Nova rota para usuários

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Middleware
app.use(express.json()); // Para processar JSON no corpo da requisição
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);
app.use('/users', usersRouter); // Adiciona todas as rotas relacionadas a usuários

// WebSocket
io.on('connection', (socket) => {
    console.log('Jogador conectado.');

    // Gerencia a aposta
    socket.on('placeBet', ({ player, betAmount }) => {
        console.log(`Aposta de R$${betAmount} no ${player}`);
        socket.emit('betPlaced', { player, betAmount });
    });

    // Envia o resultado do jogo
    socket.on('gameResult', ({ winner, betAmount, playerBet }) => {
        let outcome = {};

        if (winner === playerBet) {
            outcome.message = `Parabéns! ${winner} venceu. Você ganhou R$${(betAmount * 2).toFixed(2)}!`;
            outcome.winnings = betAmount * 2;
        } else {
            outcome.message = ` venceu. Você perdeu sua aposta de R$${betAmount.toFixed(2)}.`;
            outcome.winnings = 0;
        }

        socket.emit('gameOutcome', outcome);
    });

    socket.on('disconnect', () => {
        console.log('Jogador desconectado.');
    });
});

// Catch-all para lidar com erros 404
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start do servidor
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
