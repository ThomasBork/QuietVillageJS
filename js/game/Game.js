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

        this.maxTimeSinceLastUpdate = 24 * 60 * 60 * 1000;
    }

    prepareNewGame () {
        this.player = new Player(this);
        Data.resources.wood.enable();
        Data.jobs.woodcutter.enable();

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

        // Cap catch up duration
        if (timeSinceLastUpdate > this.maxTimeSinceLastUpdate) {
            timeSinceLastUpdate = this.maxTimeSinceLastUpdate;
            this.lastUpdate.setTime(new Date().getTime() - this.maxTimeSinceLastUpdate);
        }

        // Update until caught up
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