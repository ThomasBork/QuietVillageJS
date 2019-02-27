class BuildingsRenderer extends GameRenderer {
    constructor (game) {
        super(game);
        this.game = game;

        this.buildings = [];

        this.domBuilingsContainer = document.getElementById("buildings");

        this.redrawBuildings();
        
        this.setUpEventListeners();
    }

    setUpEventListeners() {
        this.game.onUpdate.addSubscription(this.onUpdateGame, this);

        this.game.player.onBuyBuilding.addSubscription(this.onBuyBuilding, this);
    }

    onUpdateGame () {
        this.showAffordableBuildings();
    }

    onBuyBuilding(building) {
        const uibuilding = this.buildings.find(p => p.gameElement === building);

        uibuilding.domElement.classList.add('bought');

        this.updateBuildings();
    }

    redrawBuildings() {
        this.removeChildren(this.domBuilingsContainer);

        this.buildings = [];
        this.game.player.buildings
            .filter(building => building.enabled)
            .forEach(building => {
                const newDomElement = this.cloneTemplate('.building');
                this.domBuilingsContainer.appendChild(newDomElement);
                const uibuilding = new UIElement(building, newDomElement);
                this.buildings.push(uibuilding);

                newDomElement.querySelector('.name').innerHTML = building.name;
                newDomElement.querySelector('.description').innerHTML = building.description;

                newDomElement.addEventListener('click', () => this.game.player.buyBuilding(building));
            });

        this.updateBuildings();
    }

    updateBuildings () {
        this.buildings.forEach(building => {
            if (building.gameElement.amount > 0) {
                building.domElement.querySelector('.amount').innerHTML = building.gameElement.amount;
            }
            const costLine = building.domElement.querySelector('.cost-list');
            this.removeChildren(costLine);
            Object.keys(building.gameElement.costOfNext).forEach(resourceType => {
                const newResourceLine = this.cloneTemplate('.resource-line');
                costLine.appendChild(newResourceLine);
                newResourceLine.querySelector('.label').innerHTML = resourceType;
                newResourceLine.querySelector('.value').innerHTML = this.prettyNumber(building.gameElement.costOfNext[resourceType], 0, 0, true);
            })
        });
        
        this.showAffordableBuildings();
    }

    showAffordableBuildings () {
        this.buildings.forEach(building => {
            if (this.game.player.hasResources(building.gameElement.costOfNext)) {
                building.domElement.classList.add('affordable');
            } else {
                building.domElement.classList.remove('affordable');
            }
        });
    }
}