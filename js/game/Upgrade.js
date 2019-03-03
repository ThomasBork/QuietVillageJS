class Upgrade extends GameObject {
    constructor (options) {
        super(options);
        var defaults = {
            name: "No name",
            description: "",
            cost: {},
            bought: false
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);

        this.onBuy = new Observable();
    }

    buy () {
        if (!this.bought) {
            this.bought = true;
            this.onBuy.notify(this.amount);
        }
    }

    getObjectToSave () {
        return {
            name: this.name,
            bought: this.bought,
            enabled: this.enabled
        };
    }
}