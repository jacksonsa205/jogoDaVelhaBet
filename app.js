const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the router for handling routes
app.use('/', indexRouter);

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

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
