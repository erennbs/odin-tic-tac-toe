function Player(name, mark) {
    this.name = name
    this.mark = mark,
    this.score = 0
}

function Gameboard() {
    this.board = [[null, null, null], 
                  [null, null, null], 
                  [null, null, null]]    
}

Gameboard.prototype.PrintBoard = function(){
    for (let i = 0; i < 3; i++) {
        console.log(this.board[i][0] + " | " + this.board[i][1] + " | " + this.board[i][2] + "\n");
    }
}

Gameboard.prototype.ResetBoard = function(){
    for(let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            this.board[i][j] = null;
        }
    }
}

function GameController(player1, player2) {
    const _player1 = player1;
    const _player2 = player2;

    let isFinished = false;

    const board = new Gameboard();

    let activePlayer = _player1;

    const IsFinished = () => {
        return isFinished;
    }

    const ChangeActivePlayer = () => {
        activePlayer = activePlayer === _player1 ? _player2 : _player1;
    }

    const GetActivePlayer = () => {
        return activePlayer;
    }

    const CheckIfPlacable = (row, col) => {
        return board.board[row][col] === null;
    }

    const PlayRound = (row, col) => {
        if (!CheckIfPlacable(row, col)) return;

        board.board[row][col] = activePlayer.mark;
        
        if (CheckWin(row, col)) {
            FinishGame(activePlayer);
        } else {
            ChangeActivePlayer();
        }
        
    }

    const FinishGame = () => {
        isFinished = true;
        activePlayer.score += 1;
        console.log(`Winner is ${activePlayer.name}!`);
    }

    const RestartGame = () => {
        isFinished = false;
        board.ResetBoard();
        activePlayer = _player1;
    }

    const GetPlayers = () => {
        return [_player1, _player2];
    }

    const CheckWin = (row, col) => {
        if (checkHorizontal(row) || checkVertical(col) || checkDiagonal())  
        return true;
        else return false;
    }

    const checkHorizontal = (row) => {
        for(let i = 0; i < 3; i++) {
            if(board.board[row][i] !== activePlayer.mark) return false;
        }
        return true
    }

    const checkVertical = (col) => {
        for (let i = 0; i < 3; i++) {
            if (board.board[i][col] !== activePlayer.mark) return false;
        }
        return true
    }

    const checkDiagonal = () => {
        let d1 = true
        let d2 = true
        
        for(let i = 0; i < 3; i++) {
            if(board.board[i][i] !== activePlayer.mark) d1 = false;
        }
        
        for(let i = 2; i >= 0; i--) {
            if(board.board[2 - i][i] !== activePlayer.mark) d2 = false;
        }

        return d1 || d2;
    }

    return {PlayRound, IsFinished, GetActivePlayer, CheckIfPlacable, RestartGame, GetPlayers}
}

function DOMController(gameController) {
    const _gameController = gameController;

    const p1Name = document.querySelector(".p1-name");
    const p1Score = document.querySelector(".p1-score");
    
    const p2Name = document.querySelector(".p2-name");
    const p2Score = document.querySelector(".p2-score");
    
    const restartButton = document.querySelector(".restart-button");
    const cells = document.querySelectorAll(".cells button");

    p1Name.textContent = _gameController.GetPlayers()[0].name;
    p1Score.textContent = _gameController.GetPlayers()[0].score;

    p2Name.textContent = _gameController.GetPlayers()[1].name;
    p2Score.textContent = _gameController.GetPlayers()[1].score;
    
    restartButton.addEventListener('click', (event) => {
        _gameController.RestartGame();
        ClearCells();
    })

    cells.forEach(cell => {
        cell.addEventListener('click', (event) => {
            if (_gameController.IsFinished()) return;

            let target = event.target;
            let row = Number(target.dataset.row)
            let col = Number(target.dataset.col)
            if (!gameController.CheckIfPlacable(row, col)) return;

            cell.textContent = _gameController.GetActivePlayer().mark;
            cell.style.color = _gameController.GetActivePlayer().mark == "X" ? "salmon" : "lightskyblue";
            _gameController.PlayRound(row, col);

            if (_gameController.IsFinished()) UpdateScores();
        })
    });

    const ClearCells = () => {
        cells.forEach(cell => {
            cell.textContent = "";
        })};

    const UpdateScores = () => {
        p1Score.textContent = _gameController.GetPlayers()[0].score;
        p2Score.textContent = _gameController.GetPlayers()[1].score;
    }
}

player1 = new Player("P1", "X");
player2 = new Player("P2", "O");

let game = GameController(player1, player2);
let dom = DOMController(game);

// while (!game.IsFinished()) {
//     input = prompt("Row,Column: ").split(",")
//     game.PlayRound(Number(input[0]), Number(input[1]));
// }

