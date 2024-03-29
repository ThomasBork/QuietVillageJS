Data.initResources = (player) => {
    Data.resources = {
        devotion: new Resource(RESOURCE_TYPE.DEVOTION),
        food: new Resource(RESOURCE_TYPE.FOOD),
        gold: new Resource(RESOURCE_TYPE.GOLD),
        pelt: new Resource(RESOURCE_TYPE.PELT),
        stone: new Resource(RESOURCE_TYPE.STONE),
        wood: new Resource(RESOURCE_TYPE.WOOD)
    };

    Object.values(Data.resources).forEach(resource => 
        player.resources[resource.type] = resource);
}
