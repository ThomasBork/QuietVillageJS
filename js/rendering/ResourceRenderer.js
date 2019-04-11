class ResourceRenderer extends GameRenderer {
    constructor (game) {
        super("ResourceRenderer", game);

        this.resources = [];

        this.domResourcesContainer = document.getElementById('resources');

        this.setUpEventListeners();

        this.redrawResources();
    }

    setUpEventListeners() {
        this.game.onUpdate.addSubscription(this.onUpdateGame, this);

        this.game.player.onEnableResource.addSubscription(this.onEnableResource, this);
        this.game.player.onIncomeCalculated.addSubscription(this.onIncomeCalculated, this);
    }

    onUpdateGame () {
        this.updateResources();
    }

    onEnableResource (resource) {
        this.redrawResources();
    }

    onIncomeCalculated (resources) {
        this.resources.forEach(resource => {
            const income = resources[resource.gameElement.type];
            const domIncome = resource.domElement.querySelector('.income');
            domIncome.innerHTML = this.prettyNumber(income, 2, 0);
        });
    }

    redrawResources () {
        this.removeChildren(this.domResourcesContainer);

        const resourceTypes = Object.keys(this.game.player.resources);
        
        this.resources = [];
        resourceTypes.forEach(resourceType => {
            const resource = this.game.player.resources[resourceType];
            if (resource.enabled) {
                const newDomElement = this.cloneTemplate('.resource');
                const label = newDomElement.querySelector('.label');
                label.innerHTML = resource.type;
                this.domResourcesContainer.appendChild(newDomElement);
                this.resources.push(new UIElement(resource, newDomElement));
            }
        });

        this.updateResources ();
    }

    updateResources() {
        this.resources.forEach(resource => {
            const valueElement = resource.domElement.querySelector('.value');
            let text = this.prettyNumber(resource.gameElement.amount, 0);
            if (!resource.gameElement.isUncapped){
                text += ' / ' + this.prettyNumber(resource.gameElement.cap, 0);
            }
            valueElement.innerHTML = text;
        });
    }
}