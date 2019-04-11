Data.initJobs = (player) => {
    Data.jobs = {
        idle: new Job({
            name: "Idle", 
            description: "Do nothing"
        }),
        gatherer: new ResourceJob ({
            name: "Gatherer", 
            description: "Search nearby woods for berries and shrooms", 
            resourceType: RESOURCE_TYPE.FOOD, 
            income: 2
        }),
        woodcutter: new ResourceJob ({
            name: "Woodcutter", 
            description: "Chop trees for wood", 
            resourceType: RESOURCE_TYPE.WOOD, 
            income: 1
        }),
        stonecutter: new ResourceJob ({
            name: "Stonecutter",
            description: "Collect stone",
            resourceType: RESOURCE_TYPE.STONE,
            income: 0.1
        }),
        hunter: new ResourceJob ({
            name: "Hunter", 
            description: "Hunt animals for their hide", 
            resourceType: RESOURCE_TYPE.PELT, 
            income: 1
        }),
        priest: new ResourceJob ({
            name: "Priest",
            description: "Pray to raise the spirits of the workers",
            resourceType: RESOURCE_TYPE.FAITH,
            income: 1
        }),
        researcher: new Job ({
            name: "Researcher", 
            description: "Increases research speed"
        })
    };

    player.jobs = Object.values(Data.jobs);
}
