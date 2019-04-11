Data.initEffects = () => {
    // Buildings
    Data.buildings.lumberMill.effects = [new GameObjectEfficiencyModifier(Data.jobs.woodcutter, 1.1, true)];
    Data.buildings.stoneQuarry.effects = [new GameObjectEfficiencyModifier(Data.jobs.stonecutter, 1.25, true)];
    Data.buildings.church.effects = [new GameObjectEfficiencyModifier(Data.jobs.priest, 1.1, true)];

    // Jobs

    // Upgrades
    Data.upgrades.woodenAxe.effects = [new GameObjectEfficiencyModifier(Data.jobs.woodcutter, 1.2, true)];
    Data.upgrades.sharpeningStone.effects = [
        new GameObjectEfficiencyModifier(Data.jobs.woodcutter, 1.25, true),
        new GameObjectEfficiencyModifier(Data.jobs.stonecutter, 1.25, true)
    ];

    // Research
    Data.researches.axeSharpener.effects = [new GameObjectEfficiencyModifier(Data.jobs.woodcutter, 1.1, true)];
};