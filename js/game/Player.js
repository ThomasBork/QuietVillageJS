class Player {
    constructor () {
        this.buildings = [];
        this.jobs = [];
        this.upgrades = [];
        this.researches = [];

        this.workerCount = 0;
        this.resources = {};
        this.currentResearch = null;

        Data.initBuildings(this);
        Data.initResearches(this);
        Data.initResources(this);
        Data.initJobs(this);
        Data.initUpgrades(this);
        Data.initPrerequisites(this);
        Data.initEffects(this);

        // Resources
        this.onEnableResource = new Observable();
        this.onIncomeCalculated = new Observable();
        Object.values(this.resources).forEach(resource => resource.onEnable.addSubscription(
            () => this.onEnableResource.notify(resource), this)
        );

        // Buildings
        this.onEnableBuilding = new Observable();
        this.onBuyBuilding = new Observable();
        this.buildings.forEach(building => building.onEnable.addSubscription(
            () => this.onEnableBuilding.notify(building), this)
        );

        // Upgrades
        this.onEnableUpgrade = new Observable();
        this.onBuyUpgrade = new Observable();
        this.upgrades.forEach(upgrade => upgrade.onEnable.addSubscription(
            () => this.onEnableUpgrade.notify(upgrade), this)
        );

        // Workers
        this.onEnableJob = new Observable();
        this.onWorkersAdded = new Observable();
        this.onJobWorkerCountUpdated = new Observable();
        this.jobs.forEach(job => 
            job.onEnable.addSubscription(() => this.onEnableJob.notify(job), this)
        );

        // Research
        this.onEnableResearch = new Observable();
        this.onStartResearch = new Observable();
        this.onAddResearch = new Observable();
        this.onCompleteResearch = new Observable();
        this.researches.forEach(research => {
            research.onEnable.addSubscription(() => this.onEnableResearch.notify(research), this);
            research.onAddResearch.addSubscription(amount => this.onAddResearch.notify(research, amount), this);
            research.onComplete.addSubscription(() => this.onCompleteResearch.notify(research), this);
        });


        this.enableUnlockedObjects();
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
                let multiplier = this.getJobMultiplier(job);
                flatIncome[job.resourceType] += job.workerCount * job.income * multiplier;
            }
        });

        // this.gameObjects.forEach(object => {
        //     object.effects.forEach(effect => {
        //         if (effect instanceof )
        //     });
        // });

        const income = {};
        Object.values(RESOURCE_TYPE).forEach(type => {
            income[type] = flatIncome[type] * incomeFactors[type];
        });
        return income;
    }

    get idleJob () {
        return this.jobs.find(job => job.name === 'Idle');
    }

    get gameObjects () {
        return [
            ...this.buildings, 
            ...this.upgrades, 
            ...this.jobs, 
            ...this.researches, 
            ...Object.values(this.resources)
        ];
    }

    getJobMultiplier (job) {
        let multiplier = 1;
        this.gameObjects.forEach(object => {
            if(this.isAcquired(object)) {
                object.effects.forEach(effect => {
                    if (effect instanceof GameObjectEfficiencyModifier &&
                        effect.object === job && 
                        effect.isMultiplier
                    ) {
                        if (object instanceof Building) {
                            if (object.amount > 0) {
                                multiplier *= 1 + (effect.increase - 1) * object.amount;
                            }
                        } else {
                            multiplier *= effect.increase;
                        }
                    }
                });
            }
        });
        return multiplier;
    }

    setCurrentResearch (research) {
        if (research === null || !research.completed) {
            this.currentResearch = research;
            this.onStartResearch.notify(research);
        }
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
        if (!upgrade.bought) {
            if (this.tryPayingResources(cost)) {
                upgrade.buy();
                this.recalculateResourceCaps();
                this.enableUnlockedObjects();
                this.onBuyUpgrade.notify(upgrade);
            }
        }
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

    recalculateResourceCaps () {
        this.resources[RESOURCE_TYPE.FAITH].isUncapped = true;
        this.resources[RESOURCE_TYPE.FOOD].cap = 250;
        this.resources[RESOURCE_TYPE.GOLD].cap = 250;
        this.resources[RESOURCE_TYPE.PELT].cap = 250;
        this.resources[RESOURCE_TYPE.STONE].cap = 250;
        this.resources[RESOURCE_TYPE.WOOD].cap = 250;

        for(var i = 0; i<Data.buildings.woodShed.amount; i++) {
            this.resources[RESOURCE_TYPE.WOOD].cap += 100;
        }
    }

    handleResourceIncome (dTime) {
        const timeFactor = dTime / 1000;
        const currentIncome = this.income;

        Object.values(this.resources).forEach(resource => {
            resource.amount += currentIncome[resource.type] * timeFactor;
        });

        this.onIncomeCalculated.notify(currentIncome);
    }

    capResources () {
        Object.values(this.resources).forEach(resource => {
            resource.discardAboveCap();
        });
    }

    handleResearch(dTime) {
        if (this.currentResearch && !this.currentResearch.completed) {
            const timeFactor = dTime / 1000;
            let multiplier = this.getJobMultiplier(Data.jobs.researcher);
            const researchPerResearcher = 1 * multiplier;
            const researchGained = Data.jobs.researcher.workerCount * researchPerResearcher * timeFactor;
            this.currentResearch.addResearch (researchGained);
            if (this.currentResearch.completed) {
                this.setCurrentResearch(null);
                this.enableUnlockedObjects();
            }
        }
    }

    update (dTime) {
        this.handleResourceIncome(dTime);
        this.capResources();
        this.handleResearch(dTime);
    }

    isAcquired (object) {
        if (object instanceof Job) {
            return object.enabled;
        } else if (object instanceof Resource) {
            return object.enabled;
        } else if (object instanceof Upgrade) {
            return object.bought;
        } else if (object instanceof Research) {
            return object.completed;
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
        this.gameObjects.forEach(object => this.enableUnlockedObject(object));
    }

    getObjectToSave () {
        return {
            workerCount: this.workerCount,
            currentResearch: this.currentResearch === null ? null : this.currentResearch.getObjectToSave(),
            buildings: this.buildings.map(b => b.getObjectToSave()),
            jobs: this.jobs.map(j => j.getObjectToSave()),
            upgrades: this.upgrades.map(u => u.getObjectToSave()),
            researches: this.researches.map(r => r.getObjectToSave()),
            resources: Object.values(this.resources).map(r => r.getObjectToSave())
        };
    }

    static loadFromObject(obj) {
        const player = new Player();

        player.workerCount = obj.workerCount;

        player.currentResearch = obj.currentResearch === null ? null : player.researches.find(r => r.name === obj.currentResearch.name);

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

        obj.researches.forEach(objResearch => {
            const research = player.researches.find(r => r.name === objResearch.name);
            research.completed = objResearch.completed;
            research.research = objResearch.research;
            research.enabled = objResearch.enabled;
        });
        
        obj.resources.forEach(objResource => {
            const resource = player.resources[objResource.type];
            resource.amount = objResource.amount;
            resource.enabled = objResource.enabled;
        });

        return player;
    }
}
