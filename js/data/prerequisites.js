Data.initPrerequisites = () => {
    // Resources
    Data.resources.food.prerequisites = [undefined];
    Data.resources.gold.prerequisites = [undefined];
    Data.resources.pelt.prerequisites = [Data.jobs.hunter];
    Data.resources.wood.prerequisites = [];

    // Buildings
    Data.buildings.hut.prerequisites = [];
    Data.buildings.woodShed.prerequisites = [Data.buildings.hut];

    // Jobs
    Data.jobs.hunter.prerequisites = [Data.upgrades.woodenSpear];
    Data.jobs.gatherer.prerequisites = [undefined];
    Data.jobs.researcher.prerequisites = [Data.upgrades.researchTent];

    // Upgrades
    Data.upgrades.researchTent.prerequisites = [Data.upgrades.woodenSpear];
    Data.upgrades.woodenAxe.prerequisites = [];
    Data.upgrades.woodenSpear.prerequisites = [];

    // Researches
    Data.researches.fire.prerequisites = [];
    Data.researches.ice.prerequisites = [];
};