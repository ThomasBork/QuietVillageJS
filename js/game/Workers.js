class Workers {
    constructor (player) {
        this.player = player;
        this.count = 0;
        this.jobs = [];

        this.setUpJobs();
    }

    setUpJobs () {
        this.jobs.push(new Job ("Idle", "Do nothing", () => {}));
        this.jobs.push(new Job ("Gatherer", "Search nearby woods for berries and shrooms", (deltaTime) => {}));
    }
}
