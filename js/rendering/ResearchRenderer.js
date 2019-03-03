class ResearchRenderer extends GameRenderer {
    constructor (game) {
        super("ResearchRenderer", game);
        this.researches = [];

        this.domResearchesContainer = document.getElementById("researches");

        this.redrawResearches();
        
        this.setUpEventListeners();
    }

    setUpEventListeners() {
        this.game.player.onStartResearch.addSubscription(this.onStartResearch, this);
        this.game.player.onAddResearch.addSubscription(this.onAddResearch, this);
        this.game.player.onCompleteResearch.addSubscription(this.onCompleteResearch, this);
        this.game.player.onEnableResearch.addSubscription(this.redrawResearches, this);
    }

    onStartResearch(research) {
        this.updateResearches();
    }

    onAddResearch(research, amount) {
        this.updateResearches();
    }

    onCompleteResearch(research) {
        this.updateResearches();
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
}