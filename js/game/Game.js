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
    
    addHero (hero) {
        this.player.addHero(hero);
        this.renderer.addHero(hero);
    }

    buyHero () {
        if (this.player.gold >= this.player.nextHeroCost) {
            this.player.gold -= this.player.nextHeroCost;
            const hero = new Hero();
            this.addHero(hero);
        }
    }

    buyItem (item) {
        if (item.bought && !item.enabled) {
            item.enable();
            this.renderer.enableItem(item);
        } else if (!item.bought && this.player.gold >= item.cost) {
            this.player.gold -= item.cost;
            item.buy();
            item.enable();
            this.renderer.buyItem(item);
            this.renderer.enableItem(item);
        }
    }

    buyBuilding (building) {
        if (!building.bought) {
            //this.player.gold -= building.cost;
            building.buy();
            this.renderer.buyBuilding(building);
        }
    }

    buyPassive (passive) {
        if (!passive.bought && this.player.gold >= passive.cost) {
            this.player.gold -= passive.cost;
            passive.buy();
            this.renderer.buyPassive(passive);
        }
    }

    setHeroDamageToCollectionRatio(hero, ratio) {
        const granularity = 1 / (this.player.damageToCollectionRatioSliderGranularity - 1);
        hero.damageToCollectionRatio = Math.round(ratio / granularity) * granularity;
        this.renderer.updateHero(hero);
    }

    dealDamage () {
        this.player.heroes.forEach(hero => {
            const damage = hero.damage * this.updateFrequency / 1000;
            this.gold += damage;
        });
    }

    updateCollection () {
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