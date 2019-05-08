class Game {
    constructor () {
        this.startTime = new Date();
        this.interval = null;
        this.updateFrequency = 100;
        this.updateResumeFrequency = 500;
        this.lastUpdate = new Date();

        this.onStart = new Observable();
        this.onUpdate = new Observable();
        this.onWin = new Observable();
        this.onStop = new Observable();

        this.onResumeUpdate = new Observable();
        this.onResumeEnded = new Observable();

        this.maxTimeSinceLastUpdate = 24 * 60 * 60 * 1000;
    }

    prepareNewGame () {
        this.player = new Player(this);
        Data.resources.wood.enable();
        Data.jobs.woodcutter.enable();

        this.player.addWorkers(1);
    }

    start () {
        this.player.recalculateResourceCaps();
        this.onStart.notify();

        this.interval = setInterval(() => {
            this.update();
        }, this.updateFrequency);
    }

    resume () {
        this.player.recalculateResourceCaps();

        let timeSinceLastUpdate = new Date() - this.lastUpdate;

        // Cap catch up duration
        if (timeSinceLastUpdate > this.maxTimeSinceLastUpdate) {
            timeSinceLastUpdate = this.maxTimeSinceLastUpdate;
            this.lastUpdate.setTime(new Date().getTime() - this.maxTimeSinceLastUpdate);
        }

        this.resumeLoop(timeSinceLastUpdate, timeSinceLastUpdate, this.updateResumeFrequency);
    }

    resumeLoop (totalTimeToUpdate, timeToUpdate, timeToNextResumeUpdate) {
        const loopStart = new Date();
        // Update until caught up
        while (timeToUpdate > this.updateFrequency && timeToNextResumeUpdate > 0) {
            timeToUpdate -= this.updateFrequency;
            timeToNextResumeUpdate -= new Date() - loopStart;

            this.player.update(this.updateFrequency);
        }

        const totalTimeUpdated = totalTimeToUpdate - timeToUpdate;
        if (timeToNextResumeUpdate <= 0) {
            this.onResumeUpdate.notify(totalTimeUpdated, totalTimeToUpdate);
            if (timeToUpdate > this.updateFrequency) {
                setTimeout(() => 
                    this.resumeLoop(
                        totalTimeToUpdate, 
                        timeToUpdate, 
                        timeToNextResumeUpdate + this.updateResumeFrequency
                    ), 
                    1
                );
            } else {
                this.endResume(totalTimeUpdated);
            }
        } else {
            this.endResume(totalTimeUpdated);
        }
    }

    endResume(totalTimeUpdated) {
        this.onUpdate.notify();
        this.onResumeEnded.notify();
        this.lastUpdate.setTime(this.lastUpdate.getTime() + totalTimeUpdated);
    }

    update () {
        let timeSinceLastUpdate = new Date() - this.lastUpdate;

        // Cap catch up duration
        if (timeSinceLastUpdate > this.maxTimeSinceLastUpdate) {
            timeSinceLastUpdate = this.maxTimeSinceLastUpdate;
            this.lastUpdate.setTime(new Date().getTime() - this.maxTimeSinceLastUpdate);
        }

        // Update until caught up
        while (timeSinceLastUpdate > this.updateFrequency) {
            timeSinceLastUpdate -= this.updateFrequency;
            this.lastUpdate.setTime(this.lastUpdate.getTime() + this.updateFrequency);

            this.player.update(this.updateFrequency);
        }

        this.onUpdate.notify();
    }

    win() {
        this.onWin.notify();
        this.stop();
    }

    stop () {
        clearInterval(this.interval);
        this.onStop.notify();
    }

    getObjectToSave () {
        return {
            startTime: this.startTime,
            lastUpdate: this.lastUpdate,
            player: this.player.getObjectToSave()
        };
    }

    static loadFromObject(obj) {
        const game = new Game ();
        game.startTime = new Date(obj.startTime);
        game.lastUpdate = new Date(obj.lastUpdate);
        game.player = Player.loadFromObject(obj.player);
        return game;
    }
}