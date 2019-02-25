class Game {
    constructor () {
        this.renderer = new GameRenderer(this);

        this.player = new Player(this);
        this.player.enableResource (RESOURCE_TYPE.FOOD);
        this.player.enableResource (RESOURCE_TYPE.WOOD);    
        this.player.enableJob('Woodcutter');
        this.player.enableJob('Gatherer');

        this.startTime = null;
        this.interval = null;
        this.updateFrequency = 50;
        this.lastUpdate = new Date();
    }

    buyPassive (passive) {
        if (!passive.bought && this.player.gold >= passive.cost) {
            this.player.gold -= passive.cost;
            passive.buy();
            this.renderer.buyPassive(passive);
        }
    }

    innerUpdate (dTime) {
        this.player.handleResourceIncome(dTime);
        this.player.capResources();
    }

    update () {
        let timeSinceLastUpdate = new Date() - this.lastUpdate;
        while (timeSinceLastUpdate > this.updateFrequency) {
            timeSinceLastUpdate -= this.updateFrequency;
            this.lastUpdate.setTime(this.lastUpdate.getTime() + this.updateFrequency);

            this.innerUpdate(this.updateFrequency);
        }

        this.renderer.updateResources();
        this.renderer.drawTimer();
    }

    start () {
        this.startTime = new Date();
        this.player.recalculateResourceCaps();
        this.renderer.startGame();

        this.interval = setInterval(() => {
            this.update();
        }, this.updateFrequency);
    }

    win() {
        const score = new Date() - this.startTime;
        if (!this.highScore || this.highScore > score) {
            this.highScore = score;
        }
        this.renderer.drawHighScore();
        this.stop();
    }

    stop () {
        clearInterval(this.interval);
        this.renderer.unload();
    }
}