const Player = (name, symbol) => ({ name, symbol });

const gameBoard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  const playerOne = Player('Player One', 'X');
  const playerTwo = Player('Player Two', 'O');

  // Keep track of whose turn (boolean since there's only two players)
  let turn = true;

  // Each grid cell data-set index corresponds to the gameboard array
  const placeMark = (event) => {
    const position = +event.target.dataset.index;
    if (board[position] === '') {
      if (turn) {
        board[position] = playerOne.symbol;
      } else {
        board[position] = playerTwo.symbol;
      }
      turn = !turn;
    }
  };

  const readMark = (mark) => {
    if (mark === playerOne.symbol) {
      return playerOne;
    }
    return playerTwo;
  };

  const checkWinner = () => {
    // Board full, nobody wins
    if (!gameBoard.board.includes('')) {
      return { winner: '' };
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
          winner = { winner: readMark(gameBoard.board[condition[0]]) };
        }
      }
    });

    return winner;
  };

  return { board, checkWinner, placeMark };
})();

const displayControl = (() => {
  const drawBoard = () => {
    const gridCells = document.querySelectorAll('.grid-cell');
    for (let i = 0; i < gridCells.length; i += 1) {
      gridCells[i].textContent = gameBoard.board[i];
    }
  };

  return { drawBoard };
})();

const gameControl = (() => {
  const addListeners = () => {
    const gridCells = document.querySelectorAll('.grid-cell');
    gridCells.forEach((cell) => {
      cell.addEventListener('click', (event) => {
        gameBoard.placeMark(event);
        displayControl.drawBoard();
        if (gameBoard.checkWinner() !== null) {
          console.log(gameBoard.checkWinner());
        }
      });
    });
  };

  return { addListeners };
})();

displayControl.drawBoard();

gameControl.addListeners();
