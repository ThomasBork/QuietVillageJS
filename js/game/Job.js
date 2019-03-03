class Job extends GameObject {
    constructor (options) {
        super(options);
        var defaults = {
            name: "No name",
            description: ""
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);

        this._workerCount = 0;
        this.onChangeWorkerCount = new Observable();
    }

    get workerCount () {
        return this._workerCount;
    }
    set workerCount (value) {
        this._workerCount = value;
        this.onChangeWorkerCount.notify (value);
    }

    getObjectToSave() {
        return {
            name: this.name,
            workerCount: this.workerCount,
            enabled: this.enabled
        };
    }
}

class ResourceJob extends Job {
    constructor (options) {
        super(options);
        var defaults = {
            resourceType: null,
            income: 0
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);
    }
}