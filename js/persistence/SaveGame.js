class SaveGame {
    constructor () {
        this.version = "0.01";
        this.game = null;
        this.rendererStates = {};
    }

    get json () {
        return JSON.stringify(this);
    }

    static fromJson (json) {
        const obj = JSON.parse(json);
        const saveGame = new SaveGame();
        saveGame.version = obj.version;
        saveGame.game = obj.game;
        saveGame.rendererStates = obj.rendererStates;
        return saveGame;
    }
}