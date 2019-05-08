class ResumeRenderer extends GameRenderer {
    constructor (game) {
        super("ResumeRenderer", game);

        this.domProgressBarContainer = document.querySelector('#loading-splash .progress-bar-container');
        this.domProgressBar = document.querySelector('#loading-splash .progress-bar');

        this.progessBar = new UIProgressBar(this.domProgressBarContainer, this.domProgressBar);
        this.progessBar.min = 0;
        this.progessBar.max = 1;
        
        this.setUpEventListeners();

        this.updateProgressBarValue(0);
    }

    setUpEventListeners() {
        this.game.onResumeUpdate.addSubscription(this.onResumeUpdate, this);
    }

    onResumeUpdate(timeResumed, totalTimeToResume) {
        const value = timeResumed / totalTimeToResume;
        this.updateProgressBarValue(value);
    }

    updateProgressBarValue(value) {
        this.progessBar.setValue(value);
    }
}