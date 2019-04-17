class Building extends GameObject {
    constructor (options) {
        super(options);
        var defaults = {
            name: "No name",
            description: "",
            cost: {},
            buyFunction: null,
            costAmountPowerBase: 1.5,
            costAmountMultiplier: 0
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);

        this.amount = 0;

        this.onBuy = new Observable();
    }

    get costOfNext () {
        const nextCost = {};
        Object.keys(this.cost)
            .forEach(resourceType => 
                nextCost[resourceType] = 
                    this.cost[resourceType] * Math.pow(this.costAmountPowerBase, this.amount)
                    + this.costAmountMultiplier * this.amount
            );
        return nextCost;
    }

    getCostOfNext(){
        return this.cost;
    }

    buy () {
        this.amount++;
        if (this.buyFunction) {
            this.buyFunction();
        }
        this.onBuy.notify(this.amount);
    }

    getEffectMultiplier() {
        return this.amount;
    }

    getObjectToSave () {
        return {
            name: this.name,
            amount: this.amount,
            enabled: this.enabled
        };
    }
}
