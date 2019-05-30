Data.initPrerequisites = () => {
    // Resources
    Data.resources.devotion.prerequisites = [Data.buildings.church];
    Data.resources.food.prerequisites = [undefined];
    Data.resources.gold.prerequisites = [undefined];
    Data.resources.stone.prerequisites = [Data.upgrades.pickaxe];
    Data.resources.pelt.prerequisites = [Data.jobs.hunter];
    Data.resources.wood.prerequisites = [];

    // Buildings
    Data.buildings.church.prerequisites = [Data.upgrades.pickaxe];
    Data.buildings.hut.prerequisites = [];
    Data.buildings.lumberMill.prerequisites = [Data.researches.advancedLumbering];
    Data.buildings.stoneQuarry.prerequisites = [Data.upgrades.pickaxe];
    Data.buildings.woodShed.prerequisites = [Data.buildings.hut];

    // Jobs
    Data.jobs.hunter.prerequisites = [Data.upgrades.woodenSpear];
    Data.jobs.gatherer.prerequisites = [undefined];
    Data.jobs.priest.prerequisites = [Data.buildings.church];
    Data.jobs.researcher.prerequisites = [Data.upgrades.researchTent];
    Data.jobs.stonecutter.prerequisites = [Data.upgrades.pickaxe];

    // Upgrades
    Data.upgrades.pickaxe.prerequisites = [Data.upgrades.woodenSpear];
    Data.upgrades.researchTent.prerequisites = [Data.upgrades.woodenSpear];
    Data.upgrades.sharpeningStone.prerequisites = [Data.upgrades.pickaxe];
    Data.upgrades.woodenAxe.prerequisites = [];
    Data.upgrades.woodenSpear.prerequisites = [];

    // Researches
    Data.researches.axeSharpener.prerequisites = [];
    Data.researches.advancedLumbering.prerequisites = [];
    Data.researches.heroism.prerequisites = [Data.buildings.church];
};