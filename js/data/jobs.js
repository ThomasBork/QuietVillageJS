Data.initJobs = (player) => {
    player.jobs.push(new Job ("Idle", "Do nothing"));
    player.jobs.push(new ResourceJob ("Gatherer", "Search nearby woods for berries and shrooms", RESOURCE_TYPE.FOOD, 2));
    player.jobs.push(new ResourceJob ("Woodcutter", "Chop trees for wood", RESOURCE_TYPE.WOOD, 1));
}
