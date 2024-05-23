const rows = 40
const columns = 40
const mines = 200
let board = []
let gameOver = false

// function to create the game board
function renderBoard() {
  document.getElementById("gameBoard").innerHTML = ""
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      const square = document.createElement("div")
      square.className = "square"
      if (board[x][y].flagged) {
        square.classList.add("flagged")
        square.textContent = "🚩"
      }
      if (board[x][y].revealed) {
        square.classList.add("revealed")
        if (board[x][y].isMine) {
          square.classList.add("mine")
          square.textContent ="x"
        } else if (board[x][y].count > 0) {
          square.textContent = board[x][y].count
        } 
      }
    
      // if a square is clicked on it gets revealed
      square.addEventListener("click", () => revealSquare(x, y))
      // if a square is rightclicket on it gets flagged
      square.addEventListener("contextmenu", (event) => {
        event.preventDefault()
        toggleFlag(x, y)
      })
      gameBoard.appendChild(square)
    }
    gameBoard.appendChild(document.createElement("br"))
  }
}


// function that initializes the game board
function initializeBoard() {
  // initializes every square in the board 
  // gives every cell an indication of mines, if it has been revealed and amount of mines in neighbor squares
  for (let x = 0; x < rows; x++) {
    board[x] = []
    for (let y = 0; y < columns; y++) {
        board[x][y] = {
        isMine: false,
        revealed: false,
        flagged: false,
        count: 0,
      };
    }
  }

  // Places mines in random rows and columns if it dont already have a mine in it
  let minesPlaced = 0
  while (minesPlaced < mines) {
      const row = Math.floor(Math.random() * rows)
      const col = Math.floor(Math.random() * columns)
    if (!board[row][col].isMine) {
      board[row][col].isMine = true
      minesPlaced++
    }
  }

  // Calculate amount of nearby mines in neighbor squares if the square is not a mine
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < columns; y++) {
      if (!board[x][y].isMine) {
        let count = 0
        // checks every nearby square
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            const nx = x + dx
            const ny = y + dy
            // increases the count if any nearby sqare is a mine
            if (nx >= 0 && nx < rows && ny >= 0 && ny < columns && board[nx][ny].isMine) {
              count++
            }
          }
        }
        board[x][y].count = count
      }
    }
  }
}

// function to reveal a square
function revealSquare(row, col) {
  // if the square is outside the game board or already revealed, do nothing
  if (row < 0 || row >= rows || col < 0 || col >= columns || gameOver || board[row][col].revealed || board[row][col].flagged) {
    return
  }
  board[row][col].revealed = true
  // If the revealed square was a mine, then game over
  if (board[row][col].isMine) {
    gameOver = true
  } else if (board[row][col].count === 0) {
    // If square has no mines nearby, reveal nearby squares
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        revealSquare(row + dx, col + dy)
      }
    }
  }
  renderBoard()
}

// function for toggling flagged squares
function toggleFlag(row, col) {
  if (gameOver || board[row][col].revealed) {
    return;
  }
  board[row][col].flagged = !board[row][col].flagged;
  renderBoard();
}

// function for restarting the game
function restartGame() {
    board = []
    gameOver = false
    initializeBoard()
    renderBoard()
}


initializeBoard()
renderBoard()
