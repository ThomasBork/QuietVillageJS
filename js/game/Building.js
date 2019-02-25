class Building {
    constructor (name, description, cost, buyFunction) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.buyFunction = buyFunction;
        this.enabled = false;
        this.amount = 0;
        this.powerBase = 1.5;
    }

    get costOfNext () {
        const nextCost = {};
        Object.keys(this.cost)
            .forEach(resourceType => 
                nextCost[resourceType] = this.cost[resourceType] * Math.pow(this.powerBase, this.amount)
            );
        return nextCost;
    }

    getCostOfNext(){
        return this.cost;
    }

    enable () {
        this.enabled = true;
    }

    buy () {
        this.amount++;
        this.buyFunction();
    }
}
