const socket = io();
const boardElement = document.getElementById('board');
const resultElement = document.getElementById('result');
const betInput = document.getElementById('bet-input');
const betChoice = document.getElementById('bet-choice');
const placeBetButton = document.getElementById('place-bet');
const oddsXElement = document.getElementById('odds-x');
const oddsOElement = document.getElementById('odds-o');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = false;
let playerBet = null;
let betAmount = 0;

// Odds iniciais para X e O
let oddsX = 2.0; // Odds para X
let oddsO = 1.8; // Odds para O

// Combinações vencedoras
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

// Renderiza o tabuleiro
function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        if (cell) {
            cellElement.classList.add(cell);
            cellElement.textContent = cell;
        }
        boardElement.appendChild(cellElement);
    });
}

// Exibe as odds na interface
function updateOddsDisplay() {
    oddsXElement.textContent = `Apostas X: ${oddsX.toFixed(1)}`;
    oddsOElement.textContent = `Apostas O: ${oddsO.toFixed(1)}`;
}

// Verifica se há um vencedor
function checkWin(player) {
    return winningCombinations.some(combination =>
        combination.every(index => board[index] === player)
    );
}

// Verifica se o jogo terminou em empate
function checkDraw() {
    return board.every(cell => cell !== '');
}

// Faz uma jogada automática alternada
function makeMove() {
    const availableCells = board
        .map((cell, index) => (cell === '' ? index : null))
        .filter(index => index !== null);

    if (availableCells.length === 0) return;

    const move = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[move] = currentPlayer;
    renderBoard();

    if (checkWin(currentPlayer)) {
        endGame(currentPlayer);
    } else if (checkDraw()) {
        endGame(null);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Alterna entre X e O
        setTimeout(makeMove, 500); // Aguarda 500ms para a próxima jogada
    }
}

// Finaliza o jogo
function endGame(winner) {
    gameActive = false;

    if (winner) {
        const odds = winner === 'X' ? oddsX : oddsO;
        const earnings = (betAmount * odds) - (1.4 * betAmount); // Casa retém 1.4x do valor apostado
        const message =
            playerBet === winner
                ? `Parabéns! ${winner} venceu. Você ganhou R$${earnings.toFixed(2)}!`
                : `${winner} venceu. Você perdeu sua aposta de R$${betAmount.toFixed(2)}.`;

        resultElement.innerHTML = message.replace(
            winner,
            `<span style="color: ${winner === 'X' ? '#3498db' : '#e74c3c'}; font-weight: bold;">${winner}</span>`
        );
    } else {
        resultElement.textContent = 'Empate! Ninguém ganhou.';
    }
}

// Reinicia o jogo
function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = Math.random() > 0.5 ? 'X' : 'O'; // Começa aleatoriamente com X ou O
    gameActive = true;
    renderBoard();
    setTimeout(makeMove, 500); // Começa a primeira jogada após 500ms
}

// Lida com a aposta
placeBetButton.addEventListener('click', () => {
    const betValue = parseFloat(betInput.value);
    const choice = betChoice.value;

    if (isNaN(betValue) || betValue <= 0) {
        alert('Insira um valor válido!');
        return;
    }

    playerBet = choice;
    betAmount = betValue;

    resultElement.textContent = `Você apostou R$${betValue.toFixed(2)} no ${choice}.`;
    resetGame();
});

// Renderiza o tabuleiro inicial
renderBoard();
updateOddsDisplay();
