function newGame() {
    gameManager.newGame();
}

function loadGame () {
    gameManager.loadGame();
}

function saveGame () {
    gameManager.saveGame();
}

function init () {
    gameManager = new GameManager();
    gameManager.init();
}

let gameManager;

init ();