class Building {
    constructor (name, description, cost, enableFunction) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.enableFunction = enableFunction;
        this.enabled = false;
        this.bought = false;
    }

    enable () {
        this.enabled = true;
        this.enableFunction();
    }

    buy () {
        this.bought = true;
        this.enable();
    }
}
