class ResearchRenderer extends GameRenderer {
    constructor (game) {
        super("ResearchRenderer", game);
        this.researches = [];

        this.domResearchesContainer = document.getElementById('researches');
        this.domResearchTabButtonProgessBarContainer = document.getElementById('research-tab-button-progress-bar');
        this.domResearchTabButtonProgessBar = this.domResearchTabButtonProgessBarContainer.querySelector('.progress-bar');
        this.researchTabButtonProgressBar = null;

        this.redrawResearches();
        
        this.setUpEventListeners();

        this.updateTabButtonProgressBar();
    }

    setUpEventListeners() {
        this.game.player.onStartResearch.addSubscription(this.onStartResearch, this);
        this.game.player.onAddResearch.addSubscription(this.onAddResearch, this);
        this.game.player.onCompleteResearch.addSubscription(this.onCompleteResearch, this);
        this.game.player.onEnableResearch.addSubscription(this.redrawResearches, this);
    }

    onStartResearch(research) {
        this.updateResearches();
        this.updateTabButtonProgressBar();
        this.updateTabButtonProgressBarValue();
    }

    onAddResearch(research, amount) {
        this.updateResearches();
        this.updateTabButtonProgressBarValue();
    }

    onCompleteResearch(research) {
        this.updateResearches();
        this.updateTabButtonProgressBar();
    }

    redrawResearches() {
        this.removeChildren(this.domResearchesContainer);

        this.researches = [];
        this.game.player.researches
            .filter(research => research.enabled)
            .forEach(research => {
                const newDomElement = this.cloneTemplate('.research');
                this.domResearchesContainer.appendChild(newDomElement);
                const uiResearch = new UIResearch(research, newDomElement);
                this.researches.push(uiResearch);

                newDomElement.querySelector('.name').innerHTML = research.name;
                newDomElement.querySelector('.description').innerHTML = research.description;

                newDomElement.addEventListener('click', () => this.game.player.setCurrentResearch(research));
            });

        this.updateResearches();
    }

    updateResearches () {
        this.researches.forEach(research => {
            if (research.gameElement === this.game.player.currentResearch) {
                research.domElement.classList.add('started');
            } else {
                research.domElement.classList.remove('started');
            }
            research.updateProgressBar();
            if (research.gameElement.completed) {
                research.domElement.classList.add('completed');
            }
        });
    }

    updateTabButtonProgressBar() {
        if (this.game.player.currentResearch) {
            this.domResearchTabButtonProgessBarContainer.style.display = 'block';
            this.researchTabButtonProgessBar = new UIProgressBar(this.domResearchTabButtonProgessBarContainer, this.domResearchTabButtonProgessBar);
            this.researchTabButtonProgessBar.min = 0;
            this.researchTabButtonProgessBar.max = this.game.player.currentResearch.researchRequired;
    
            this.updateTabButtonProgressBarValue();
        } else {
            this.domResearchTabButtonProgessBarContainer.style.display = 'none';
        }
    }

    updateTabButtonProgressBarValue() {
        if (this.game.player.currentResearch) {
            this.researchTabButtonProgessBar.setValue(this.game.player.currentResearch.research);
        }
    }
}