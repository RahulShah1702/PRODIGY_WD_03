const board = document.getElementById('board');
const messageDisplay = document.getElementById('message');
const resetButton = document.getElementById('reset');
const pvpButton = document.getElementById('pvp');
const pvcButton = document.getElementById('pvc');
const xWinsDisplay = document.getElementById('xWins');
const oWinsDisplay = document.getElementById('oWins');
const drawsDisplay = document.getElementById('draws');
let boardState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
let isPvC = false;
let xWins = 0;
let oWins = 0;
let draws = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    handlePlayerMove(clickedCell, clickedCellIndex);
    if (gameActive && isPvC) {
        handleAIMove();
    }
}

function handlePlayerMove(cell, index) {
    boardState[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkForWinner();

    // Switch players for Player vs Player
    if (!isPvC) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function handleAIMove() {
    const emptyCells = boardState.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
    let move = findBestMove(boardState, 'O');
    if (move === -1) {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    boardState[move] = 'O';
    const cell = document.querySelector(`.cell[data-index="${move}"]`);
    cell.textContent = 'O';
    checkForWinner();
}

function findBestMove(board, player) {
    const opponent = player === 'X' ? 'O' : 'X';

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }

    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === opponent && board[b] === opponent && board[c] === '') return c;
        if (board[a] === opponent && board[c] === opponent && board[b] === '') return b;
        if (board[b] === opponent && board[c] === opponent && board[a] === '') return a;
    }

    return -1;
}

function checkForWinner() {
    for (const condition of winningConditions) {
        const [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            gameActive = false;
            messageDisplay.textContent = `${boardState[a]} wins!`;
            updateStats(boardState[a]);
            return;
        }
    }
    if (!boardState.includes('')) {
        gameActive = false;
        messageDisplay.textContent = 'It\'s a draw!';
        draws++;
        drawsDisplay.textContent = draws;
    }
}

function updateStats(winner) {
    if (winner === 'X') {
        xWins++;
        xWinsDisplay.textContent = xWins;
    } else {
        oWins++;
        oWinsDisplay.textContent = oWins;
    }
}

function createBoard() {
    board.innerHTML = '';
    boardState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    messageDisplay.textContent = '';
    currentPlayer = 'X';

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }
}

function startPvP() {
    isPvC = false;
    resetButton.style.display = 'none';
    createBoard();
}

function startPvC() {
    isPvC = true;
    resetButton.style.display = 'none';
    createBoard();
}

pvpButton.addEventListener('click', () => {
    startPvP();
    resetButton.style.display = 'block';
});

pvcButton.addEventListener('click', () => {
    startPvC();
    resetButton.style.display = 'block';
});

resetButton.addEventListener('click', createBoard);
