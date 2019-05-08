class HeroArenaMonsterType {
    constructor (options) {
        var defaults = {
            attributes: [],
            name: "No name"
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);
    }
}
