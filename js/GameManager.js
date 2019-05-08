class GameManager {
    constructor () {
        this.game = null;
        this.gameRenderers = [];
    }

    init () {
        window.addEventListener("beforeunload", saveGame);
    
        if (localStorage.getItem('savedGame')) {
            this.loadGame();
        } else {
            this.hideLoadingScreen();
        }
    }
    
    newGame() {
        if(this.game) {
            this.game.stop();
        }
        this.game = new Game();
        this.game.prepareNewGame();
        this.setUpRenderers();
        document.getElementById('game').style.display = 'flex';
        this.game.start();
    }

    showLoadingScreen () {
        document.getElementById('header').style.display = 'none';
        document.getElementById('game').style.display = 'none';
        document.getElementById('loading-splash').style.display = 'block';
    }

    hideLoadingScreen () {
        document.getElementById('header').style.display = 'block';
        document.getElementById('game').style.display = 'flex';
        document.getElementById('loading-splash').style.display = 'none';
    }

    loadGame () {
        this.showLoadingScreen();

        if(this.game) {
            this.game.stop();
        }
        const saveGame = SaveGame.fromJson(localStorage.getItem('savedGame'));
        const gameObject = saveGame.game;

        try {
            this.game = Game.loadFromObject(gameObject);
        }
        catch (e) {
            this.hideLoadingScreen();
            throw e;
        }
        
        let resumeRenderer = new ResumeRenderer(this.game);

        this.game.onResumeEnded.addSubscription(this.onGameLoaded, this);
        this.game.resume();
    }

    onGameLoaded () {
        const saveGame = SaveGame.fromJson(localStorage.getItem('savedGame'));

        this.setUpRenderers();
        this.gameRenderers.forEach(renderer => {
            const rendererState = saveGame.rendererStates[renderer.name];
            if (rendererState) {
                renderer.loadStateFromObject(rendererState);
            }
        });
        
        this.hideLoadingScreen();

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