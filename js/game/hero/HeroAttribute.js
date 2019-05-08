class HeroAttribute {
    static BuildZeroSet () {
        const attributes = {};
        Object.values(HERO_ATTRIBUTE_TYPE).forEach(attributeKey => 
            attributes[attributeKey] = 0
        );
        return attributes;
    }
    static BuildDefaultSet () {
        return this.BuildSet({
            HEALTH: 100,
            SPEED: 1,
            DAMAGE: 10
        });
    }
    static BuildSet (partialSet) {
        const attributes = HeroAttribute.BuildZeroSet();
        Object.keys(partialSet).forEach(attributeKey => 
            attributes[HERO_ATTRIBUTE_TYPE[attributeKey]] = partialSet[attributeKey]
        );
        return attributes;
    }
}
