class UIResearch extends UIElement {
    constructor (gameElement, domElement) {
        super(gameElement, domElement);
        const domProgressBarContainer = domElement.querySelector('.progress-bar-container');
        const domProgressBar = domProgressBarContainer.querySelector('.progress-bar');
        this.progressBar = new UIProgressBar(domProgressBarContainer, domProgressBar);
        this.progressBar.min = 0;
        this.progressBar.max = gameElement.researchRequired;
    }

    updateProgressBar () {
        this.progressBar.setValue(this.gameElement.research);
    }
}