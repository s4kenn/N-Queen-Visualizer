document.getElementById("start").addEventListener("click", function () {
  const N = parseInt(document.getElementById("board-size").value);
  const boardElement = document.getElementById("board");
  const logsElement = document.getElementById("logs");
  boardElement.innerHTML = "";
  logsElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${N}, 50px)`;
  boardElement.style.gridTemplateRows = `repeat(${N}, 50px)`;

  function createBoard() {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add((i + j) % 2 === 0 ? "white" : "black");
        cell.id = `cell-${i}-${j}`;
        boardElement.appendChild(cell);
      }
    }
  }

  function log(message) {
    const logEntry = document.createElement("div");
    logEntry.classList.add("log-entry");
    logEntry.textContent = message;
    logsElement.appendChild(logEntry);
    logsElement.scrollTop = logsElement.scrollHeight;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function solveNQueens() {
    const board = Array.from({ length: N }, () => Array(N).fill(false));

    if (await solve(board, 0)) {
      log("Solution found");
    } else {
      log("No solution exists");
    }
  }

  async function solve(board, col) {
    if (col === N) return true;

    for (let row = 0; row < N; row++) {
      if (isSafe(board, row, col)) {
        board[row][col] = true;
        log(`Placing queen at (${row}, ${col})`);
        await placeQueen(row, col);

        if (await solve(board, col + 1)) {
          return true;
        }

        board[row][col] = false;
        log(`Removing queen from (${row}, ${col})`);
        await removeQueen(row, col);
      }
    }

    return false;
  }

  function isSafe(board, row, col) {
    for (let i = 0; i < col; i++) {
      if (board[row][i]) return false;
    }

    for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j]) return false;
    }

    for (let i = row, j = col; i < N && j >= 0; i++, j--) {
      if (board[i][j]) return false;
    }

    return true;
  }

  async function placeQueen(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.textContent = "♛";
    cell.classList.add("queen");
    await sleep(1000);
  }

  async function removeQueen(row, col) {
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.textContent = "";
    cell.classList.remove("queen");
    await sleep(1000);
  }

  createBoard();
  solveNQueens();
});
