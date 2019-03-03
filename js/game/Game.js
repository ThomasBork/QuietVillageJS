class Game {
    constructor () {
        this.startTime = new Date();
        this.interval = null;
        this.updateFrequency = 100;
        this.lastUpdate = new Date();

        this.onStart = new Observable();
        this.onUpdate = new Observable();
        this.onWin = new Observable();
        this.onStop = new Observable();
    }

    prepareNewGame () {
        this.player = new Player(this);
        this.player.enableResource (RESOURCE_TYPE.WOOD);    
        this.player.enableJob('Woodcutter');
        this.player.enableBuilding(Data.buildings.hut);

        this.player.resources[RESOURCE_TYPE.WOOD].amount = 200;
        this.player.addWorkers(1);
    }

    start () {
        this.player.recalculateResourceCaps();
        this.onStart.notify();

        this.interval = setInterval(() => {
            this.update();
        }, this.updateFrequency);
    }

    resume () {
        this.player.recalculateResourceCaps();
        this.update();
    }

    update () {
        let timeSinceLastUpdate = new Date() - this.lastUpdate;
        while (timeSinceLastUpdate > this.updateFrequency) {
            timeSinceLastUpdate -= this.updateFrequency;
            this.lastUpdate.setTime(this.lastUpdate.getTime() + this.updateFrequency);

            this.player.update(this.updateFrequency);
        }
        this.onUpdate.notify();
    }

    win() {
        this.onWin.notify();
        this.stop();
    }

    stop () {
        clearInterval(this.interval);
        this.onStop.notify();
    }

    getObjectToSave () {
        return {
            startTime: this.startTime,
            lastUpdate: this.lastUpdate,
            player: this.player.getObjectToSave()
        };
    }

    static loadFromObject(obj) {
        const game = new Game ();
        game.startTime = new Date(obj.startTime);
        game.lastUpdate = new Date(obj.lastUpdate);
        game.player = Player.loadFromObject(obj.player);
        return game;
    }
}