function newGame() {
    if(game) {
        game.stop();
    }
    game = new Game();
    game.prepareNewGame();
    gameRenderers = [
        new HUDRenderer(game),
        new ResourceRenderer(game),
        new BuildingsRenderer(game),
        new WorkersRenderer(game)
    ];
    game.start();
}

let game;
let gameRenderers = [];