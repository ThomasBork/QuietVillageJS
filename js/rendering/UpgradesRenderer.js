class UpgradesRenderer extends GameRenderer {
    constructor (game) {
        super("UpgradesRenderer", game);

        this.upgrades = [];

        this.domUpgradesContainer = document.getElementById("upgrades");

        this.redrawUpgrades();
        
        this.setUpEventListeners();
    }

    setUpEventListeners() {
        this.game.onUpdate.addSubscription(this.onUpdateGame, this);

        this.game.player.onBuyUpgrade.addSubscription(this.onBuyUpgrade, this);
        this.game.player.onEnableUpgrade.addSubscription(this.redrawUpgrades, this);
    }

    onUpdateGame () {
        this.showAffordableUpgrades();
    }

    onBuyUpgrade(upgrade) {
        this.updateUpgrades();
    }

    redrawUpgrades() {
        this.removeChildren(this.domUpgradesContainer);

        this.upgrades = [];
        this.game.player.upgrades
            .filter(upgrade => upgrade.enabled)
            .forEach(upgrade => {
                const newDomElement = this.cloneTemplate('.upgrade');
                this.domUpgradesContainer.appendChild(newDomElement);
                const uiUpgrade = new UIElement(upgrade, newDomElement);
                this.upgrades.push(uiUpgrade);

                newDomElement.querySelector('.name').innerHTML = upgrade.name;
                newDomElement.querySelector('.description').innerHTML = upgrade.description;

                newDomElement.addEventListener('click', () => this.game.player.buyUpgrade(upgrade));
            });

        this.updateUpgrades();
    }

    updateUpgrades () {
        this.upgrades.forEach(upgrade => {
            if (upgrade.gameElement.bought) {
                upgrade.domElement.classList.add('bought');
            }
            const costList = upgrade.domElement.querySelector('.cost-list');
            this.removeChildren(costList);
            Object.keys(upgrade.gameElement.cost).forEach(resourceType => {
                const newResourceLine = this.cloneTemplate('.resource-line');
                costList.appendChild(newResourceLine);
                newResourceLine.querySelector('.label').innerHTML = resourceType;
                newResourceLine.querySelector('.value').innerHTML = this.prettyNumber(upgrade.gameElement.cost[resourceType], 0, 0, true);
            });
        });

        this.showAffordableUpgrades();
    }

    showAffordableUpgrades () {
        this.upgrades.forEach(upgrade => {
            if (this.game.player.hasResources(upgrade.gameElement.cost)) {
                upgrade.domElement.classList.add('affordable');
            } else {
                upgrade.domElement.classList.remove('affordable');
            }
        });
    }
}