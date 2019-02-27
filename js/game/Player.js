class Player {
    constructor (game) {
        this.game = game;
        this.highScore = null;
        this.buildings = [];
        this.passives = [];
        this.actives = [];
        this.jobs = [];

        this.workerCount = 0;
        this.resources = {};

        Data.initPassives(this);
        Data.initBuildings(this);
        Data.initResources(this);
        Data.initJobs(this);

        this.onBuyBuilding = new Observable();
        this.onEnableResource = new Observable();
        this.onEnableJob = new Observable();
        this.onWorkersAdded = new Observable();
        this.onJobWorkerCountUpdated = new Observable();
        this.onBuildingEnabled = new Observable ();
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

    enableBuilding (buildingName) {
        const building = this.buildings.find(building => building.name === buildingName);
        if (!building.enabled) {
            building.enable();
            this.onBuildingEnabled.notify(building);
        }
    }

    buyBuilding (building) {
        const cost = building.costOfNext;
        if (this.tryPayingResources(cost)) {
            building.buy();
            this.recalculateResourceCaps();
            this.onBuyBuilding.notify(building);
        }
    }

    enableResource(resourceType) {
        const resource = this.resources[resourceType];
        resource.enabled = true;
        this.onEnableResource.notify(resource);
    }

    enableJob(jobName) {
        const job = this.jobs.find(job => job.name === jobName);
        job.enabled = true;
        this.onEnableJob.notify(job);
    }

    addWorkers (amount) {
        this.workerCount += amount;
        this.idleJob.workerCount += amount;
        this.onWorkersAdded.notify(amount);
    }

    setAmountOfWorkersOnJob (job, workerCount) {
        let difference = workerCount - job.workerCount;
        difference = Math.min(difference, this.idleJob.workerCount);
        job.workerCount += difference;
        this.idleJob.workerCount -= difference;
        this.onJobWorkerCountUpdated.notify(job, workerCount);
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

    update (dTime) {
        this.handleResourceIncome(dTime);
        this.capResources();
    }
}
