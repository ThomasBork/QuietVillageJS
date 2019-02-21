class Item {
    constructor (hero, name, description, cost, enableFunction, disableFunction) {
        this.hero = hero;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.enableFunction = enableFunction;
        this.disableFunction = disableFunction;
        this.enabled = false;
        this.bought = false;
    }

    enable () {
        if (!this.enabled) {
            this.hero.weapons.forEach(i => i.disable());
            this.enabled = true;
            this.enableFunction();
        }
    }

    buy () {
        this.bought = true;
    }

    disable () {
        if (this.enabled) {
            this.enabled = false;
            this.disableFunction();
        }
    }
}