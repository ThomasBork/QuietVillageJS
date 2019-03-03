class GameManager {
    constructor () {
        this.game = null;
        this.gameRenderers = [];
    }

    init () {
        window.addEventListener("beforeunload", saveGame);
    
        if (localStorage.getItem('savedGame')) {
            this.loadGame();
        }
    }
    
    newGame() {
        if(this.game) {
            this.game.stop();
        }
        this.game = new Game();
        this.game.prepareNewGame();
        this.setUpRenderers();
        this.game.start();
    }

    loadGame () {
        if(this.game) {
            this.game.stop();
        }
        const saveGame = SaveGame.fromJson(localStorage.getItem('savedGame'));
        const gameObject = saveGame.game;
        this.game = Game.loadFromObject(gameObject);
        this.game.resume();
        this.setUpRenderers();
        this.gameRenderers.forEach(renderer => {
            const rendererState = saveGame.rendererStates[renderer.name];
            if (rendererState) {
                renderer.loadStateFromObject(rendererState);
            }
        });
        this.game.start();
    }

    saveGame () {
        if (this.game) {
            const saveGame = new SaveGame();
            saveGame.game = this.game.getObjectToSave();
            this.gameRenderers.forEach(renderer => 
                saveGame.rendererStates[renderer.name] = renderer.getObjectToSave()
            );
            const saveGameJson = saveGame.json;
            localStorage.setItem('savedGame', saveGameJson);
        }
    }

    setUpRenderers () {
        this.gameRenderers = [
            new HUDRenderer(this.game),
            new BuildingsRenderer(this.game),
            new ResearchRenderer(this.game),
            new ResourceRenderer(this.game),
            new UpgradesRenderer(this.game),
            new WorkersRenderer(this.game)
        ];
    }
}