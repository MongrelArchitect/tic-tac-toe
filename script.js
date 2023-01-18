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

  return { board, placeMark };
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

function listeners() {
  const gridCells = document.querySelectorAll('.grid-cell');
  gridCells.forEach((cell) => {
    cell.addEventListener('click', (event) => {
      gameBoard.placeMark(event);
      displayControl.drawBoard();
    });
  });
}

displayControl.drawBoard();

listeners();
