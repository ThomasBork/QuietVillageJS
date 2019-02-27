class Game {
    constructor () {
        this.player = new Player(this);

        this.startTime = null;
        this.interval = null;
        this.updateFrequency = 50;
        this.lastUpdate = new Date();

        this.onStart = new Observable();
        this.onUpdate = new Observable();
        this.onWin = new Observable();
        this.onStop = new Observable();
    }

    prepareNewGame () {
        this.player.enableResource (RESOURCE_TYPE.FOOD);
        this.player.enableResource (RESOURCE_TYPE.WOOD);    
        this.player.enableJob('Woodcutter');
        this.player.enableJob('Gatherer');
        this.player.enableBuilding('Hut');
        this.player.enableBuilding('Barn');

        this.player.resources[RESOURCE_TYPE.WOOD].amount = 20;
        this.player.workerCount = 0;
    }

    start () {
        this.startTime = new Date();
        this.player.recalculateResourceCaps();
        this.onStart.notify();

        this.interval = setInterval(() => {
            this.update();
        }, this.updateFrequency);
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
        const score = new Date() - this.startTime;
        if (!this.highScore || this.highScore > score) {
            this.highScore = score;
        }
        this.onWin.notify();
        this.stop();
    }

    stop () {
        clearInterval(this.interval);
        this.onStop.notify();
    }
}