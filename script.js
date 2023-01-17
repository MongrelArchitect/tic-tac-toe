const gameBoard = (() => {
  const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'X'];

  return { board };
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

displayControl.drawBoard();
