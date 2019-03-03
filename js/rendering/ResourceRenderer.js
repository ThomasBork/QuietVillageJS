class ResourceRenderer extends GameRenderer {
    constructor (game) {
        super("ResourceRenderer", game);
        this.game = game;

        this.resources = [];

        this.domResourcesContainer = document.getElementById('resources');

        this.setUpEventListeners();

        this.redrawResources();
    }

    setUpEventListeners() {
        this.game.onUpdate.addSubscription(this.onUpdateGame, this);

        this.game.player.onEnableResource.addSubscription(this.onEnableResource, this);
    }

    onUpdateGame () {
        this.updateResources();
    }

    onEnableResource (resource) {
        this.redrawResources();
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
            const text = this.prettyNumber(resource.gameElement.amount, 0) + ' / ' + this.prettyNumber(resource.gameElement.cap, 0);
            valueElement.innerHTML = text;
        });
    }
}