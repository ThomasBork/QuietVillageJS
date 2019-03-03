Data.initPrerequisites = () => {
    // Buildings
    Data.buildings.woodShed.prerequisites = [Data.buildings.hut];

    // Jobs
    Data.jobs.gatherer.prerequisites = [undefined];
    Data.jobs.hunter.prerequisites = [Data.upgrades.woodenSpear];
    Data.jobs.researcher.prerequisites = [Data.upgrades.researchTent];

    // Upgrades
    Data.upgrades.woodenSpear.prerequisites = [];
    Data.upgrades.woodenAxe.prerequisites = [];
    Data.upgrades.researchTent.prerequisites = [Data.upgrades.woodenSpear];
};