class Player {
    constructor () {
        this.buildings = [];
        this.jobs = [];
        this.upgrades = [];

        this.workerCount = 0;
        this.resources = {};

        Data.initBuildings(this);
        Data.initResources(this);
        Data.initJobs(this);
        Data.initUpgrades(this);
        Data.initPrerequisites(this);
        Data.initEffects(this);

        this.onEnableBuilding = new Observable ();
        this.onBuyBuilding = new Observable();
        this.onEnableUpgrade = new Observable ();
        this.onBuyUpgrade = new Observable();
        this.onEnableResource = new Observable();
        this.onEnableJob = new Observable();
        this.onWorkersAdded = new Observable();
        this.onJobWorkerCountUpdated = new Observable();

        this.buildings.forEach(building => building.onEnable.addSubscription(
            () => this.onEnableBuilding.notify(building),
            this
        ));

        this.upgrades.forEach(upgrade => upgrade.onEnable.addSubscription(
            () => this.onEnableUpgrade.notify(upgrade),
            this
        ));
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

    enableBuilding (building) {
        if (!building.enabled) {
            building.enable();
        }
    }

    buyBuilding (building) {
        const cost = building.costOfNext;
        if (this.tryPayingResources(cost)) {
            building.buy();
            this.recalculateResourceCaps();
            this.enableUnlockedObjects();
            this.onBuyBuilding.notify(building);
        }
    }

    enableUpgrade (upgrade) {
        if (!upgrade.enabled) {
            upgrade.enable();
        }
    }

    buyUpgrade (upgrade) {
        const cost = upgrade.cost;
        if (this.tryPayingResources(cost)) {
            upgrade.buy();
            this.recalculateResourceCaps();
            this.enableUnlockedObjects();
            this.onBuyUpgrade.notify(upgrade);
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
        this.resources[RESOURCE_TYPE.FOOD].cap = 250;
        this.resources[RESOURCE_TYPE.GOLD].cap = 250;
        this.resources[RESOURCE_TYPE.WOOD].cap = 250;

        for(var i = 0; i<Data.buildings.woodShed.amount; i++) {
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

    isAcquired (object) {
        if (object instanceof Job) {
            return object.enabled > 0;
        } else if (object instanceof Resource) {
            return object.enabled;
        } else if (object instanceof Building) {
            return object.amount > 0;
        } else if (object === undefined) {
            return false;
        } else {
            return false;
        }
    }

    meetsRequirements (object) {
        if (object.prerequisites) {
            return object.prerequisites.every(prerequisite => this.isAcquired(prerequisite));
        } else {
            throw { object: object, message: "Object does not have prerequisites" };
        }
    }

    enableUnlockedObject(object) {
        if (this.meetsRequirements(object)) {
            object.enable();
        }
    }

    enableUnlockedObjects() {
        this.buildings.forEach(object => this.enableUnlockedObject(object));
        this.upgrades.forEach(object => this.enableUnlockedObject(object));
    }

    getObjectToSave () {
        return {
            buildings: this.buildings.map(b => b.getObjectToSave()),
            jobs: this.jobs.map(j => j.getObjectToSave()),
            upgrades: this.upgrades.map(u => u.getObjectToSave()),
            workerCount: this.workerCount,
            resources: Object.values(this.resources).map(r => r.getObjectToSave())
        };
    }

    static loadFromObject(obj) {
        const player = new Player();

        obj.jobs.forEach(objJob => {
            const job = player.jobs.find(j => j.name === objJob.name);
            job.workerCount = objJob.workerCount;
            job.enabled = objJob.enabled;
        });

        obj.buildings.forEach(objBuilding => {
            const building = player.buildings.find(b => b.name === objBuilding.name);
            building.amount = objBuilding.amount;
            building.enabled = objBuilding.enabled;
        });

        obj.upgrades.forEach(objUpgrade => {
            const upgrade = player.upgrades.find(u => u.name === objUpgrade.name);
            upgrade.bought = objUpgrade.bought;
            upgrade.enabled = objUpgrade.enabled;
        });

        player.workerCount = obj.workerCount;
        
        obj.resources.forEach(objResource => {
            const resource = player.resources[objResource.type];
            resource.amount = objResource.amount;
            resource.enabled = objResource.enabled;
        });

        return player;
    }
}
