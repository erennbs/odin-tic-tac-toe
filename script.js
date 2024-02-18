class Player {

    constructor(name, mark) {
        this.name = name
        this.mark = mark,
        this.score = 0
    }
}

class Gameboard {
    constructor() {
        this.board = [[null, null, null], 
                      [null, null, null], 
                      [null, null, null]]    
    }

    PrintBoard() {
        for (let i = 0; i < 3; i++) {
            console.log(this.board[i][0] + " | " + this.board[i][1] + " | " + this.board[i][2] + "\n");
        }
    }

    ResetBoard() {
        for(let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.board[i][j] = null;
            }
        }
    }
}

class GameController {
    #player1;
    #player2;
    #activePlayer;
    
    #isFinished = false;
    #board = new Gameboard();
    
    constructor(player1, player2) {
        this.#player1 = player1;
        this.#player2 = player2;
        
        this.#activePlayer = this.#player1;
    }

    IsFinished() {
        return this.#isFinished;
    }

    #ChangeActivePlayer() {
        this.#activePlayer = this.#activePlayer === this.#player1 ? this.#player2 : this.#player1;
    }

    GetActivePlayer() {
        return this.#activePlayer;
    }

    CheckIfPlacable(row, col) {
        return this.#board.board[row][col] === null;
    }

    PlayRound(row, col) {
        if (!this.CheckIfPlacable(row, col)) return;

        this.#board.board[row][col] = this.#activePlayer.mark;
        
        if (this.#CheckWin(row, col)) {
            this.#FinishGame(this.#activePlayer);
        } else {
            this.#ChangeActivePlayer();
        }
        
    }

    #FinishGame() {
        this.#isFinished = true;
        this.#activePlayer.score += 1;
        console.log(`Winner is ${this.#activePlayer.name}!`);
    }

    RestartGame() {
        this.#isFinished = false;
        this.#board.ResetBoard();
        this.#activePlayer = this.#player1;
    }

    GetPlayers() {
        return [this.#player1, this.#player2];
    }

    #CheckWin(row, col) {
        if (this.#CheckHorizontal(row) || this.#CheckVertical(col) || this.#CheckDiagonal())  
        return true;
        else return false;
    }

    #CheckHorizontal(row) {
        for(let i = 0; i < 3; i++) {
            if(this.#board.board[row][i] !== this.#activePlayer.mark) return false;
        }
        return true
    }

    #CheckVertical(col) {
        for (let i = 0; i < 3; i++) {
            if (this.#board.board[i][col] !== this.#activePlayer.mark) return false;
        }
        return true
    }

    #CheckDiagonal() {
        let d1 = true
        let d2 = true
        
        for(let i = 0; i < 3; i++) {
            if(this.#board.board[i][i] !== this.#activePlayer.mark) d1 = false;
        }
        
        for(let i = 2; i >= 0; i--) {
            if(this.#board.board[2 - i][i] !== this.#activePlayer.mark) d2 = false;
        }

        return d1 || d2;
    }
}

class DOMController {
    #gameController;
    
    #p1Name;
    #p1Score;
    
    #p2Name
    #p2Score;

    #restartButton
    #cells;

    constructor(gameController) {
        this.#gameController = gameController;

        this.#p1Name = document.querySelector(".p1-name");
        this.#p1Score = document.querySelector(".p1-score");
        
        this.#p2Name = document.querySelector(".p2-name");
        this.#p2Score = document.querySelector(".p2-score");
        
        this.#restartButton = document.querySelector(".restart-button");
        this.#cells = document.querySelectorAll(".cells button");
    
        this.#p1Name.textContent = this.#gameController.GetPlayers()[0].name;
        this.#p1Score.textContent = this.#gameController.GetPlayers()[0].score;
    
        this.#p2Name.textContent = this.#gameController.GetPlayers()[1].name;
        this.#p2Score.textContent = this.#gameController.GetPlayers()[1].score;
        
        this.#restartButton.addEventListener('click', (event) => {
            this.#gameController.RestartGame();
            this.#ClearCells();
        });
    
        this.#cells.forEach(cell => {
            cell.addEventListener('click', (event) => {
                if (this.#gameController.IsFinished()) return;
    
                let target = event.target;
                let row = Number(target.dataset.row)
                let col = Number(target.dataset.col)
                if (!this.#gameController.CheckIfPlacable(row, col)) return;
    
                cell.textContent = this.#gameController.GetActivePlayer().mark;
                cell.style.color = this.#gameController.GetActivePlayer().mark == "X" ? "salmon" : "lightskyblue";
                this.#gameController.PlayRound(row, col);
    
                if (this.#gameController.IsFinished()) this.#UpdateScores();
            })
        });
    }

    #ClearCells() {
        this.#cells.forEach(cell => {
            cell.textContent = "";
        })};

    #UpdateScores() {
        this.#p1Score.textContent = this.#gameController.GetPlayers()[0].score;
        this.#p2Score.textContent = this.#gameController.GetPlayers()[1].score;
    }
}

player1 = new Player("P1", "X");
player2 = new Player("P2", "O");

let game = new GameController(player1, player2);
let dom = new DOMController(game);

// while (!game.IsFinished()) {
//     input = prompt("Row,Column: ").split(",")
//     game.PlayRound(Number(input[0]), Number(input[1]));
// }

