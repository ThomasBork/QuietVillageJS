Data.initEffects = () => {
    // Buildings
    Data.buildings.lumberMill.effects = [new GameObjectEfficiencyModifier(Data.jobs.woodcutter, 1.1, true)];
    Data.buildings.woodShed.effects = [new ResourceCap(RESOURCE_TYPE.WOOD, 100, false)];
    Data.buildings.stoneQuarry.effects = [new GameObjectEfficiencyModifier(Data.jobs.stonecutter, 1.25, true)];
    Data.buildings.church.effects = [new GameObjectEfficiencyModifier(Data.jobs.priest, 1.1, true)];

    // Jobs
    Data.jobs.woodcutter.effects = [new IncomeEffect(RESOURCE_TYPE.WOOD, 1, false)];
    Data.jobs.stonecutter.effects = [new IncomeEffect(RESOURCE_TYPE.STONE, 0.1, false)];
    Data.jobs.hunter.effects = [new IncomeEffect(RESOURCE_TYPE.PELT, 1, false)];
    Data.jobs.priest.effects = [new IncomeEffect(RESOURCE_TYPE.DEVOTION, 1, false)];

    // Upgrades
    Data.upgrades.woodenAxe.effects = [new GameObjectEfficiencyModifier(Data.jobs.woodcutter, 1.2, true)];
    Data.upgrades.sharpeningStone.effects = [
        new GameObjectEfficiencyModifier(Data.jobs.woodcutter, 1.25, true),
        new GameObjectEfficiencyModifier(Data.jobs.stonecutter, 1.25, true)
    ];

    // Research
    Data.researches.axeSharpener.effects = [new GameObjectEfficiencyModifier(Data.jobs.woodcutter, 1.1, true)];

    // Hidden Game Objects
    Data.hiddenGameObjects.devotionDecay.effects = [new IncomeEffect(RESOURCE_TYPE.DEVOTION, -1, false)];
};