class Research extends GameObject {
    constructor (options) {
        super(options);
        var defaults = {
            name: "No name",
            description: "",
            researchRequired: 100
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);

        this.research = 0;
        this.completed = false;
        this.onComplete = new Observable();
        this.onAddResearch = new Observable();
    }

    addResearch(amount) {
        if (amount > 0) {
            this.research += amount;
            this.onAddResearch.notify(amount);
            if (this.research >= this.researchRequired) {
                this.research = this.researchRequired;
                this.complete();
            }
        }
    }

    complete () {
        if (!this.completed) {
            this.completed = true;
            this.onComplete.notify();
        }
    }

    getObjectToSave () {
        return {
            name: this.name,
            completed: this.completed,
            research: this.research,
            enabled: this.enabled
        };
    }
}