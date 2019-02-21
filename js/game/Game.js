class Game {
    constructor () {
        this.renderer = new GameRenderer(this);

        this.player = new Player(this);
        this.player.enableResource (RESOURCE_TYPE.FOOD);

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
        this.player.heroes.forEach(hero => {
            const potentialCollection = hero.collection * this.updateFrequency / 1000;
            if (this.gold >= potentialCollection) {
                this.player.gold += potentialCollection;
                this.gold -= potentialCollection;
            } else {
                this.player.gold += this.gold;
                this.gold = 0;
            }
        });
    }

    innerUpdate (dTime) {
        this.dealDamage();
        this.updateCollection();
    }

    update () {
        let timeSinceLastUpdate = new Date() - this.lastUpdate;
        while (timeSinceLastUpdate > this.updateFrequency) {
            timeSinceLastUpdate -= this.updateFrequency;
            this.lastUpdate.setTime(this.lastUpdate.getTime() + this.updateFrequency);
        }

        this.renderer.updateResources();
        this.renderer.drawTimer();
    }

    start () {
        this.startTime = new Date();
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