class SaveGame {
    constructor () {
        this.version = SaveGame.currentVersion;
        this.game = null;
        this.rendererStates = {};
    }

    get json () {
        return JSON.stringify(this);
    }

    static fromJson (json) {
        let obj = JSON.parse(json);
        if (obj.version === '0.01') {
            obj = SaveGame.upgradeFrom001(obj);
        }
        const saveGame = new SaveGame();
        saveGame.version = obj.version;
        saveGame.game = obj.game;
        saveGame.rendererStates = obj.rendererStates;
        return saveGame;
    }

    static upgradeFrom001 (obj) {
        let json = JSON.stringify(obj);
        json = json
            .replace('FAITH', 'DEVOTION')
            .replace('Faith', 'Devotion');
        const newObj = JSON.parse(json);
        newObj.version = '0.2.0';
        return newObj;
    }
}

SaveGame.currentVersion = '0.3.0';