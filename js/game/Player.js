class Player {
    constructor (game) {
        this.game = game;
        this.highScore = null;
        this.buildings = [];
        this.heroes = [];
        this.passives = [];
        this.actives = [];
        this.jobs = [];

        this.workerCount = 0;
        this.resources = {};

        Data.initPassives(this);
        Data.initBuildings(this);
        Data.initResources(this);
        Data.initJobs(this);

        this.resources[RESOURCE_TYPE.WOOD].amount = 20;
    }

    get nextHeroCost () {
        const baseCost = 100;
        const scalingFactor = 100;
        const scalingExponent = 2;
        const scalingCost = scalingFactor * Math.pow(scalingExponent, this.heroes.length); 
        return baseCost + scalingCost;
    }

    get income () {
        const flatIncome = {};
        const incomeFactors = {};
        Object.values(RESOURCE_TYPE).forEach(type => {
            flatIncome[type] = 0;
            incomeFactors[type] = 1;
        });

        this.jobs.forEach(job => {
            if (job instanceof ResourceJob) {
                flatIncome[job.resourceType] += job.workerCount * job.income;
            }
        });

        const income = {};
        Object.values(RESOURCE_TYPE).forEach(type => {
            income[type] = flatIncome[type] * incomeFactors[type];
        });
        return income;
    }

    get idleJob () {
        return this.jobs.find(job => job.name === 'Idle');
    }

    hasResources(resources) {
        return Object.keys(resources).every(resourceType => 
            this.resources[resourceType].amount >= resources[resourceType]);
    }

    payResources(resources) {
        return Object.keys(resources).forEach(resourceType => 
            this.resources[resourceType].amount -= resources[resourceType]);
    }

    tryPayingResources(resources) {
        if (this.hasResources(resources)) {
            this.payResources(resources);
            return true;
        } else {
            return false;
        }
    }

    buyBuilding (building) {
        const cost = building.costOfNext;
        if (this.tryPayingResources(cost)) {
            building.buy();
            this.recalculateResourceCaps();
            this.game.renderer.onBuyBuilding(building);
        }
    }

    enableResource(resourceType) {
        const resource = this.resources[resourceType];
        resource.enabled = true;
        this.game.renderer.onResourceEnabled (resource);
    }

    enableJob(jobName) {
        const job = this.jobs.find(job => job.name === jobName);
        job.enabled = true;
        this.game.renderer.onJobEnabled(job);
    }

    addWorkers (amount) {
        this.workerCount += amount;
        this.idleJob.workerCount += amount;
        this.game.renderer.updateJobs();
    }

    setAmountOfWorkersOnJob (job, workerCount) {
        let difference = workerCount - job.workerCount;
        difference = Math.min(difference, this.idleJob.workerCount);
        job.workerCount += difference;
        this.idleJob.workerCount -= difference;
        this.game.renderer.updateJobs();
    }

    addHero (hero) {
        hero.player = this;
        this.heroes.push(hero);
    }

    getBuilding (name) {
        return this.buildings.find(b => b.name === name);
    }

    recalculateResourceCaps () {
        this.resources[RESOURCE_TYPE.FOOD].cap = 500;
        this.resources[RESOURCE_TYPE.GOLD].cap = 500;
        this.resources[RESOURCE_TYPE.WOOD].cap = 500;

        for(var i = 0; i<this.getBuilding('Barn').amount; i++) {
            this.resources[RESOURCE_TYPE.FOOD].cap += 100;
            this.resources[RESOURCE_TYPE.GOLD].cap += 50;
            this.resources[RESOURCE_TYPE.WOOD].cap += 100;
        }
    }

    handleResourceIncome (dTime) {
        const timeFactor = dTime / 1000;

        Object.values(this.resources).forEach(resource => {
            resource.amount += this.income[resource.type] * timeFactor;
        });
    }

    capResources () {
        Object.values(this.resources).forEach(resource => {
            resource.discardAboveCap();
        });
    }
}
