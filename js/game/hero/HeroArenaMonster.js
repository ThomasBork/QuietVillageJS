class HeroArenaMonster extends HeroCharacter {
    constructor (options) {
        super(options);
        var defaults = {
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);
    }
}
