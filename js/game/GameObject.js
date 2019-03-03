class GameObject {
    constructor (options) {
        var defaults = {
            prerequisites: [],
            effects: [],
            enabled: false
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);

        this.onEnable = new Observable();
    }

    enable () {
        if (!this.enabled) {
            this.enabled = true;
            this.onEnable.notify();
        }
    }
}