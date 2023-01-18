const Player = (name, symbol) => ({ name, symbol });

const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const playerOne = Player('Player One', 'X');
  const playerTwo = Player('Player Two', 'O');

  // Keep track of whose turn (boolean since there's only two players)
  let turn = true;

  const whoseTurn = () => {
    if (turn) {
      return playerOne;
    }
    return playerTwo;
  };

  // Each grid cell data-set index corresponds to the gameboard array
  const placeMark = (event) => {
    const position = +event.target.dataset.index;
    // Don't do anything if the space isn't clear
    if (board[position] === '') {
      if (turn) {
        board[position] = playerOne.symbol;
      } else {
        board[position] = playerTwo.symbol;
      }
      turn = !turn;
    }
  };

  // Identify the winning player by their mark
  const readMark = (mark) => {
    if (mark === playerOne.symbol) {
      return playerOne;
    }
    return playerTwo;
  };

  const checkWinner = () => {
    // Board full, nobody wins
    if (!gameBoard.board.includes('')) {
      return { name: 'Nobody' };
    }

    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let winner = null;

    winConditions.forEach((condition) => {
      // Three in a row - we have a winner...
      if (
        gameBoard.board[condition[0]] === gameBoard.board[condition[1]]
        && gameBoard.board[condition[0]] === gameBoard.board[condition[2]]
      ) {
        // ...unless it's three empty spaces
        if (gameBoard.board[condition[0]] !== '') {
          winner = readMark(gameBoard.board[condition[0]]);
        }
      }
    });

    return winner;
  };

  const reset = () => {
    // Clear the board and start over with player one's turn
    for (let i = 0; i < board.length; i += 1) {
      board[i] = '';
    }
    turn = true;
  };

  return {
    board,
    whoseTurn,
    checkWinner,
    placeMark,
    reset,
    turn,
    playerOne,
    playerTwo,
  };
})();

const displayControl = (() => {
  // Populate the grid with player marks from the gameboard
  const drawBoard = () => {
    const gridCells = document.querySelectorAll('.grid-cell');
    for (let i = 0; i < gridCells.length; i += 1) {
      gridCells[i].textContent = gameBoard.board[i];
    }
    const currentPlayer = document.querySelector('.current-player');
    currentPlayer.textContent = gameBoard.whoseTurn().name;
  };

  // We've got a game over so show the reset section
  const showReset = (winner) => {
    const header = document.querySelector('.header');
    header.classList.add('extended');
    const gameOver = document.querySelector('.game-over');
    gameOver.classList.remove('hidden');
    const winnerName = document.querySelector('.winner-name');
    winnerName.textContent = winner.name;

    const resetButton = document.querySelector('#reset');
    resetButton.addEventListener('click', () => {
      // clear the board & reset
      gameBoard.reset();
      gameOver.classList.add('hidden');
      header.classList.remove('extended');
      drawBoard();
    });
  };

  const setupGame = () => {
    const header = document.querySelector('.header');
    const playerOneName = document.querySelector('#player-one-name');
    const playerTwoName = document.querySelector('#player-two-name');
    const startButton = document.querySelector('#start');
    const gameSettings = document.querySelector('.game-settings');

    startButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (!playerOneName.value) {
        gameBoard.playerOne.name = 'Player One';
      } else {
        gameBoard.playerOne.name = playerOneName.value;
      }

      if (!playerTwoName.value) {
        gameBoard.playerTwo.name = 'Player Two';
      } else {
        gameBoard.playerTwo.name = playerTwoName.value;
      }

      header.classList.remove('extended');
      gameSettings.classList.add('hidden');
      drawBoard();
    });
  };

  return { drawBoard, showReset, setupGame };
})();

const gameControl = (() => {
  const playGame = () => {
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach((cell) => {
      cell.addEventListener('click', (event) => {
        gameBoard.placeMark(event);
        displayControl.drawBoard();
        if (gameBoard.checkWinner() !== null) {
          displayControl.showReset(gameBoard.checkWinner());
        }
      });
    });
  };

  return { playGame };
})();

displayControl.setupGame();

gameControl.playGame();
