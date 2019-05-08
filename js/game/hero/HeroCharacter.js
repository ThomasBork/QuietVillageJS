class HeroCharacter {
    constructor (options) {
        var defaults = {
            name: "No name",
            currentHealth: 0,
            attackCooldown: 0,
            attributes: null,
            baseAttributes: null,
            level: 1
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);

        this.recalculateAttributes();
        this.setToFullHealth();
        this.resetAttackCooldown();
    }

    get isAlive () {
        return this.currentHealth > 0;
    }

    setToFullHealth () {
        this.currentHealth = this.attributes[HERO_ATTRIBUTE_TYPE.HEALTH];
    }

    resetAttackCooldown () {
        this.attackCooldown = this.attributes[HERO_ATTRIBUTE_TYPE.SPEED];
    }

    recalculateAttributes () {
        const attributes = {};
        Object.values(HERO_ATTRIBUTE_TYPE).forEach(attributeKey => 
            attributes[attributeKey] = this.level * this.baseAttributes[attributeKey]
        );
        this.attributes = attributes;
    }
}
