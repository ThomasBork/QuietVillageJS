class WorkersRenderer extends GameRenderer {
    constructor (game) {
        super(game);
        this.game = game;

        this.jobs = [];

        this.domIdleWorkers = document.getElementById('idle-workers');
        this.domJobList = document.getElementById('job-list');

        this.setUpEventListeners();

        this.redrawJobs();
    }

    setUpEventListeners() {
        this.game.player.onEnableJob.addSubscription(this.onEnableJob, this);
        this.game.player.onWorkersAdded.addSubscription(this.updateJobs, this);
        this.game.player.onJobWorkerCountUpdated.addSubscription(this.updateJobs, this);
    }

    onEnableJob (job) {
        this.redrawJobs();
    }

    redrawJobs () {
        this.removeChildren(this.domJobList);

        this.jobs = [];
        this.game.player.jobs.forEach(job => {
            if (job !== this.game.player.idleJob) {
                const newDomElement = this.cloneTemplate('.job-line');
                this.domJobList.appendChild(newDomElement);
                const uiElement = new UIElement(job, newDomElement);
                this.jobs.push(uiElement);

                const rangeElement = newDomElement.querySelector('.amount-range');
                rangeElement.addEventListener('input', () => this.game.player.setAmountOfWorkersOnJob(job, rangeElement.value));
                rangeElement.addEventListener('change', () => this.game.player.setAmountOfWorkersOnJob(job, rangeElement.value));
            }
        });

        this.updateJobs();
    }

    updateJobs () {
        this.domIdleWorkers.innerHTML = this.game.player.idleJob.workerCount;

        this.jobs.forEach(job => {
            const nameElement = job.domElement.querySelector('.name');
            nameElement.innerHTML = job.gameElement.name;
            const amountElement = job.domElement.querySelector('.amount');
            amountElement.innerHTML = job.gameElement.workerCount;
            const rangeElement = job.domElement.querySelector('.amount-range');
            rangeElement.max = this.game.player.workerCount;
            rangeElement.value = job.gameElement.workerCount;
        });
    }
}