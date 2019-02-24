class Resource {
    constructor (type) {
        this.type = type;
        this.amount = 0;
        this.cap = 0;
        this.income = 0;
        this.enabled = false;
    }

    discardAboveCap () {
        if (this.amount > this.cap) {
            this.amount = this.cap;
        }
    }
}