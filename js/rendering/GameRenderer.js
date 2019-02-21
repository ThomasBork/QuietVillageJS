class GameRenderer {
    constructor (game) {
        this.game = game;
        this.domGameContainer = document.getElementById('game');

        this.domResourcesContainer = document.getElementById('resources');

        this.domTimer = document.getElementById('timer');
        this.domHighScore = document.getElementById('high-score');
        this.domHighScoreContainer = document.getElementById('high-score-container');

        this.domHeroDetails = document.getElementById('hero-details');
        this.domItems = document.getElementById('items');
        
        this.domHeroesContainer = document.getElementById("heroes");
        this.domBuilingsContainer = document.getElementById("buildings");
        this.domPassivesContainer = document.getElementById("passives");

        this.domWorkersTabButton = document.getElementById('workers-tab-button');
        this.domBuildingsTabButton = document.getElementById('buildings-tab-button');
        this.domHeroesTabButton = document.getElementById('heroes-tab-button');
        this.domPassivesTabButton = document.getElementById('passives-tab-button');
        this.domActivesTabButton = document.getElementById('actives-tab-button');
        this.domTabButtons = [this.domWorkersTabButton, this.domBuildingsTabButton, this.domHeroesTabButton, this.domPassivesTabButton, this.domActivesTabButton];

        this.domWorkersTab = document.getElementById('workers-tab');
        this.domBuildingsTab = document.getElementById('buildings-tab');
        this.domHeroesTab = document.getElementById('heroes-tab');
        this.domPassivesTab = document.getElementById('passives-tab');
        this.domActivesTab = document.getElementById('actives-tab');
        this.domTabs = [this.domWorkersTab, this.domBuildingsTab, this.domHeroesTab, this.domPassivesTab, this.domActivesTab];

        this.resources = [];

        this.heroes = [];
        this.buildings = [];
        this.passives = [];

        this.items = [];

        this.domElementsToRemoveAtCleanUp = [];
    }

    cloneTemplate (cssSelector) {
        const newNode = document.querySelector('#templates ' + cssSelector).cloneNode(true);
        this.domElementsToRemoveAtCleanUp.push(newNode);
        return newNode;
    }
    
    prettyNumber (number, decimals) {
        const multiplier = Math.pow(10, decimals);
        return Math.floor(number * multiplier) / multiplier;
    }

    startGame () {
        this.addBuildings();
        this.addPassives();
        this.domGameContainer.style.display = 'flex';
        this.closeHeroDetails();
        this.selectWorkersTab();
    }

    onResourceEnabled (resource) {
        this.redrawResources();
    }

    redrawResources () {
        this.removeChildren(this.domResourcesContainer);

        const resourceTypes = Object.keys(this.game.player.resources);
        
        this.resources = [];
        resourceTypes.forEach(resourceType => {
            const resource = this.game.player.resources[resourceType];
            const newDomElement = this.cloneTemplate('.resource');
            const label = newDomElement.querySelector('.label');
            label.innerHTML = resource.type;
            this.domResourcesContainer.appendChild(newDomElement);
            this.resources.push(new UIElement(resource, newDomElement));
        });

        this.updateResources ();
    }

    updateResources() {
        this.resources.forEach(resource => {
            const valueElement = resource.domElement.querySelector('.value');
            let text = resource.gameElement.amount + '/' + resource.gameElement.cap;
            if (resource.gameElement.income !== 0) {
                text += ' (' + resource.gameElement.income + ')';
            }
            valueElement.innerHTML = text;
        });
    }

    addHero (hero) {
        const newDomElement = this.cloneTemplate('.hero');
        this.domHeroesContainer.appendChild(newDomElement);
        const uiHero = new UIElement(hero, newDomElement);
        this.heroes.push(uiHero);
        this.updateHero(hero);

        const ratioSlider = newDomElement.querySelector('.damageToCollectionRatio');
        ratioSlider.addEventListener('input', () => this.game.setHeroDamageToCollectionRatio(hero, ratioSlider.value / 100));
        ratioSlider.addEventListener('change', () => this.game.setHeroDamageToCollectionRatio(hero, ratioSlider.value / 100));

        const detailsButton = newDomElement.querySelector('.view-details-button');
        detailsButton.addEventListener('click', (event) => this.showHeroDetails(hero));

        this.updateNewHeroButton();

        if (this.heroes.length > 1) {
            this.showHeroDetails(hero);
        }
    }

    addPassives() {
        this.game.player.passives.forEach(passive => {
            const newDomElement = this.cloneTemplate('.passive-skill');
            this.domPassivesContainer.appendChild(newDomElement);
            const uiPassive = new UIElement(passive, newDomElement);
            this.passives.push(uiPassive);

            newDomElement.querySelector('.name').innerHTML = passive.name;
            newDomElement.querySelector('.cost').innerHTML = passive.cost;
            newDomElement.querySelector('.description').innerHTML = passive.description;

            newDomElement.addEventListener('click', () => this.game.buyPassive(passive));
        });
    }

    addBuildings() {
        this.game.player.buildings.forEach(building => {
            const newDomElement = this.cloneTemplate('.building');
            this.domBuilingsContainer.appendChild(newDomElement);
            const uibuilding = new UIElement(building, newDomElement);
            this.buildings.push(uibuilding);

            newDomElement.querySelector('.name').innerHTML = building.name;
            newDomElement.querySelector('.cost').innerHTML = building.cost;
            newDomElement.querySelector('.description').innerHTML = building.description;

            newDomElement.addEventListener('click', () => this.game.buyBuilding(building));
        });
    }

    buyPassive(passive) {
        const uiPassive = this.passives.find(p => p.gameElement === passive);

        uiPassive.domElement.classList.add('bought');

        this.game.player.heroes.forEach(hero => this.updateHero(hero));
    }

    buyBuilding(building) {
        const uibuilding = this.buildings.find(p => p.gameElement === building);

        uibuilding.domElement.classList.add('bought');

        this.game.player.heroes.forEach(hero => this.updateHero(hero));
    }

    buyItem(item) {
        const uiItem = this.items.find(i => i.gameElement === item);

        uiItem.domElement.classList.add('bought');

        this.game.player.heroes.forEach(hero => this.updateHero(hero));

        this.updateItem(item);
    }

    enableItem(item) {
        const uiItem = this.items.find(i => i.gameElement === item);

        this.items.forEach(i => i.domElement.classList.remove('enabled'));
        uiItem.domElement.classList.add('enabled');

        this.game.player.heroes.forEach(hero => this.updateHero(hero));

        this.updateItem(item);
    }

    showHeroDetails (hero) {
        const uiHero = this.heroes.find(h => h.gameElement === hero);
        this.domHeroDetails.style.display = 'block';
        this.heroes.forEach(h => h.domElement.classList.remove('selected'));
        uiHero.domElement.classList.add('selected');

        this.removeChildren(this.domItems);
        this.items = [];

        hero.weapons.forEach(item => {
            const newDomElement = this.cloneTemplate('.item');
            this.domItems.appendChild(newDomElement);
            const uiItem = new UIElement(item, newDomElement);
            this.items.push(uiItem);

            newDomElement.querySelector('.name').innerHTML = item.name;
            newDomElement.querySelector('.cost').innerHTML = item.cost;
            newDomElement.querySelector('.description').innerHTML = item.description;

            newDomElement.addEventListener('click', () => this.game.buyItem(item));

            this.updateItem(item);
        });
    }

    updateItem(item) {
        const uiItem = this.items.find(i => i.gameElement === item);
        if (item.enabled) {
            uiItem.domElement.classList.add('enabled');
        }
        if (item.bought) {
            uiItem.domElement.classList.add('bought');
        }
    }

    updateNewHeroButton () {
        document.getElementById('new-hero-cost').innerHTML = this.game.player.nextHeroCost;
    }

    updateHero (hero) {
        const uiHero = this.heroes.find(h => h.gameElement === hero);

        const gameHero = uiHero.gameElement;
        const domHero = uiHero.domElement;
        domHero.querySelector('.level').innerHTML = gameHero.level;
        domHero.querySelector('.total-damage').innerHTML = this.prettyNumber(gameHero.damage, 2);
        domHero.querySelector('.total-collection').innerHTML = this.prettyNumber(gameHero.collection, 2);
        
        domHero.querySelector('.damageToCollectionRatio').value = Math.floor(gameHero.damageToCollectionRatio * 100);
    }

    prettyDuration (timeInMilliseconds) {
        const timeInSeconds = Math.floor(timeInMilliseconds / 1000);
        const seconds = timeInSeconds % 60;
        const minutes = Math.floor(timeInSeconds / 60);
        let text = null;
        if (seconds < 10) {
            text = minutes + ':0' + seconds;
        } else {
            text = minutes + ':' + seconds;
        }
        return text;
    }

    drawTimer () {
        const time = new Date() - this.game.startTime;
        const text = this.prettyDuration(time);
        this.domTimer.innerHTML = text;
    }

    drawHighScore () {
        const text = this.prettyDuration(this.game.highScore);
        this.domHighScore.innerHTML = text;
        this.domHighScoreContainer.style.display = 'inline';
    }

    selectTab(tabButton, tab) {
        this.domTabButtons.forEach(t => t.classList.remove('selected'));
        tabButton.classList.add('selected');

        this.domTabs.forEach(t => t.classList.remove('selected'));
        tab.classList.add('selected');
    }

    selectWorkersTab() {
        this.selectTab(this.domWorkersTabButton, this.domWorkersTab);
    }

    selectBuildingsTab() {
        this.selectTab(this.domBuildingsTabButton, this.domBuildingsTab);
    }

    selectHeroesTab() {
        this.selectTab(this.domHeroesTabButton, this.domHeroesTab);
    }

    selectPassivesTab() {
        this.selectTab(this.domPassivesTabButton, this.domPassivesTab);
    }

    selectActivesTab() {
        this.selectTab(this.domActivesTabButton, this.domActivesTab);
    }

    closeHeroDetails() {
        this.domHeroDetails.style.display = 'none';
    }

    removeChildren (domElement) {
        while (domElement.firstChild) {
            domElement.removeChild(domElement.firstChild);
        }
    }

    unload () {
        this.domElementsToRemoveAtCleanUp.forEach(element => {
            if (element.parentElement) {
                element.parentElement.removeChild(element);
            }
        });
        this.domElementsToRemoveAtCleanUp = [];
        
        this.domTimer.innerHTML = '';

        this.domGameContainer.style.display = 'none';
    }
}