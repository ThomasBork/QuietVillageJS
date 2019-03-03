class Resource extends GameObject {
    constructor (type) {
        super({});

        this.type = type;
        this.amount = 0;
        this.cap = 0;
    }

    discardAboveCap () {
        if (this.amount > this.cap) {
            this.amount = this.cap;
        }
    }

    getObjectToSave() {
        return {
            type: this.type,
            amount: this.amount,
            enabled: this.enabled
        };
    }
}