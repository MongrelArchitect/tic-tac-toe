const Player = (name, symbol, isComp) => {
  const computerPlay = (board) => {
    // Will search through these to find either a win or block
    const options = {
      0: [
        [3, 6],
        [1, 2],
        [4, 8],
      ],
      1: [
        [4, 7],
        [0, 2],
      ],
      2: [
        [5, 8],
        [0, 1],
        [4, 6],
      ],
      3: [
        [0, 6],
        [4, 5],
      ],
      4: [
        [1, 7],
        [3, 5],
        [0, 8],
        [2, 6],
      ],
      5: [
        [2, 8],
        [3, 4],
      ],
      6: [
        [0, 3],
        [7, 8],
        [2, 4],
      ],
      7: [
        [1, 4],
        [6, 8],
      ],
      8: [
        [2, 5],
        [6, 7],
        [0, 4],
      ],
    };

    let choice = null;
    const keys = Object.keys(options);
    // First search for a pending win
    for (let i = 0; i < keys.length; i += 1) {
      if (choice) {
        break;
      }
      const currentOption = options[i];
      for (let j = 0; j < currentOption.length; j += 1) {
        if (
          board[currentOption[j][0]] !== ''
          && board[currentOption[j][1]] !== ''
          && board[currentOption[j][0]] === board[currentOption[j][1]]
          && board[currentOption[j][0]] === symbol
        ) {
          // Found a winning move!
          if (board[i] === '') {
            choice = i;
            break;
          }
        }
      }
    }

    // If there's no wins, do it again & search for a block
    if (!choice) {
      for (let i = 0; i < keys.length; i += 1) {
        if (choice) {
          break;
        }
        const currentOption = options[i];
        for (let j = 0; j < currentOption.length; j += 1) {
          if (
            board[currentOption[j][0]] !== ''
            && board[currentOption[j][1]] !== ''
            && board[currentOption[j][0]] === board[currentOption[j][1]]
          ) {
            if (board[i] === '') {
              choice = i;
              break;
            }
          }
        }
      }
    }

    // Couldn't find a pending win or block so choose at random
    if (!choice) {
      choice = Math.floor(Math.random() * board.length);
      // Don't enter this loop at all if the board is full
      if (board.includes('')) {
        while (board[choice] !== '') {
          choice = Math.floor(Math.random() * board.length);
        }
      }
    }

    return choice;
  };

  return {
    name,
    symbol,
    isComp,
    computerPlay,
  };
};

const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const playerOne = Player('Player One', 'X', false);
  const playerTwo = Player('Player Two', 'O', false);

  // Keep track of whose turn (boolean since there's only two players)
  let turn = true;

  const whoseTurn = () => {
    if (turn) {
      return playerOne;
    }
    return playerTwo;
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

  // Each grid cell data-set index corresponds to the gameboard array
  const placeMark = (event) => {
    const position = +event.target.dataset.index;
    // Don't do anything if the space isn't clear
    if (board[position] === '') {
      if (turn) {
        board[position] = playerOne.symbol;
        if (!playerTwo.isComp) {
          turn = !turn;
        } else if (gameBoard.checkWinner() === null) {
          // Other player is computer - let them play if nobody has won
          board[playerTwo.computerPlay(board)] = playerTwo.symbol;
        }
      } else {
        board[position] = playerTwo.symbol;
        turn = !turn;
      }
    }
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
    const gameInfo = document.querySelector('.game-info');
    gameInfo.textContent = `${gameBoard.whoseTurn().name}'s turn`;
    if (gameBoard.playerTwo.isComp) {
      gameInfo.textContent = 'Playing against computer';
    }
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
    const playerOneSymbol = document.querySelector('#player-one-symbol');
    const playerTwoName = document.querySelector('#player-two-name');
    const playerTwoSymbol = document.querySelector('#player-two-symbol');
    const startButton = document.querySelector('#start');
    const gameSettings = document.querySelector('.game-settings');
    const comp = document.querySelector('#comp');

    startButton.addEventListener('click', (event) => {
      event.preventDefault();

      if (comp.checked) {
        gameBoard.playerTwo.isComp = true;
      }

      // Set default names if the user doesn't enter any
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

      // Set default symbols if the user doesn't enter any
      if (!playerOneSymbol.value) {
        gameBoard.playerOne.symbol = 'X';
      } else {
        gameBoard.playerOne.symbol = playerOneSymbol.value;
      }
      if (!playerTwoSymbol.value) {
        gameBoard.playerTwo.symbol = 'O';
      } else {
        gameBoard.playerTwo.symbol = playerTwoSymbol.value;
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
