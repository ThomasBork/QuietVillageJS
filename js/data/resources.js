Data.initResources = (player) => {
    player.resources[RESOURCE_TYPE.FOOD] = new Resource(RESOURCE_TYPE.FOOD);
    player.resources[RESOURCE_TYPE.WOOD] = new Resource(RESOURCE_TYPE.WOOD);
    player.resources[RESOURCE_TYPE.GOLD] = new Resource(RESOURCE_TYPE.GOLD);
}
