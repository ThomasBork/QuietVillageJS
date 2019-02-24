class Building {
    constructor (name, description, cost, buyFunction) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.buyFunction = buyFunction;
        this.enabled = false;
        this.amount = 0;
    }

    enable () {
        this.enabled = true;
    }

    buy () {
        this.amount++;
        this.buyFunction();
    }
}
