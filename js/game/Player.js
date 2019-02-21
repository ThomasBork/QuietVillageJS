class Player {
    constructor (game) {
        this.game = game;
        this.highScore = null;
        this.workers = new Workers();
        this.buildings = [];
        this.heroes = [];
        this.passives = [];
        this.actives = [];

        this.resources = {};

        Data.initPassives(this);
        Data.initBuildings(this);
        Data.initResources(this);
    }

    get nextHeroCost () {
        const baseCost = 100;
        const scalingFactor = 100;
        const scalingExponent = 2;
        const scalingCost = scalingFactor * Math.pow(scalingExponent, this.heroes.length); 
        return baseCost + scalingCost;
    }

    enableResource(resourceType) {
        const resource = this.resources[resourceType];
        resource.enabled = true;
        this.game.renderer.onResourceEnabled (resource);
    }

    addHero (hero) {
        hero.player = this;
        this.heroes.push(hero);
    }
}
