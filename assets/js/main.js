let playerSymbol = '';
let computerSymbol = '';
let currentTurn = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;

function chooseSymbol(symbol) {
    playerSymbol = symbol;
    computerSymbol = (symbol === 'X') ? 'O' : 'X';
    currentTurn = 'X'; // Always start with X's turn
    document.getElementById('chooseSymbol').classList.add('hidden');
    document.getElementById('gameBoard').classList.remove('hidden');
    updateTurnIndicator();

    // If the computer is X, it should play first
    if (computerSymbol === 'X') {
        setTimeout(computerMove, 500); // Computer plays first if the player chose O
    }
}

function makeMove(cellIndex) {
    if (board[cellIndex] === '' && !gameOver) {
        board[cellIndex] = currentTurn;
        document.getElementById('cell-' + cellIndex).innerText = currentTurn;
        if (checkWin()) {
            displayResult(currentTurn + ' wins!');
            gameOver = true;
            document.getElementById('restartButton').classList.remove('hidden'); // Show restart button
            return;
        }
        if (checkDraw()) {
            displayResult('It\'s a draw!');
            gameOver = true;
            document.getElementById('restartButton').classList.remove('hidden'); // Show restart button
            return;
        }
        switchTurn();
        updateTurnIndicator();
        
        if (currentTurn === computerSymbol && !gameOver) {
            setTimeout(computerMove, 500); // Give a short delay for computer's move
        }
    }
}

function computerMove() {
    let move = findBestMove();
    makeMove(move);
}

function findBestMove() {
    // Step 1: Check if the computer can win
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = computerSymbol;
            if (checkWin()) {
                board[i] = ''; // Revert board after testing
                return i; // Take the winning move
            }
            board[i] = ''; // Revert board after testing
        }
    }

    // Step 2: Check if the player is about to win, and block them
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = playerSymbol;
            if (checkWin()) {
                board[i] = ''; // Revert board after testing
                return i; // Block the player from winning
            }
            board[i] = ''; // Revert board after testing
        }
    }

    // Step 3: Take the center if available
    if (board[4] === '') {
        return 4;
    }

    // Step 4: Take a corner if available
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (board[corner] === '') {
            return corner;
        }
    }

    // Step 5: Take any remaining available space
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            return i;
        }
    }
}

function switchTurn() {
    currentTurn = (currentTurn === 'X') ? 'O' : 'X';
}

function updateTurnIndicator() {
    const playerTurnIndicator = document.getElementById('playerTurn');
    const computerTurnIndicator = document.getElementById('computerTurn');
    
    if (currentTurn === playerSymbol) {
        playerTurnIndicator.classList.remove('hidden');
        computerTurnIndicator.classList.add('hidden');
    } else {
        playerTurnIndicator.classList.add('hidden');
        computerTurnIndicator.classList.remove('hidden');
    }
}

function checkWin() {
    const winConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

function checkDraw() {
    return board.every(cell => cell !== '');
}


function displayResult(message) {
    document.getElementById('resultText').innerText = message;
    document.getElementById('resultMessage').classList.remove('hidden');

    // Show confetti if there's a win
    if (message.includes('wins')) {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    // Show the restart button
    document.getElementById('restartButton').classList.remove('hidden');
}

function restartGame() {
    // Reset the game state
    board = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    document.getElementById('restartButton').classList.add('hidden'); // Hide restart button
    document.querySelectorAll('td').forEach(cell => cell.innerText = ''); // Clear all cells
    currentTurn = 'X'; // Reset turn to X

    // Hide the result message
    document.getElementById('resultMessage').classList.add('hidden');
    
    // Hide or show the choose symbol screen again
    document.getElementById('chooseSymbol').classList.remove('hidden');
    document.getElementById('gameBoard').classList.add('hidden');
}
