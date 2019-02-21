class Item {
    constructor (hero, name, description, cost, enableFunction, disableFunction) {
        this.hero = hero;
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.enableFunction = enableFunction;
        this.disableFunction = disableFunction;
        this.enabled = false;
        this.bought = false;
    }

    enable () {
        if (!this.enabled) {
            this.hero.weapons.forEach(i => i.disable());
            this.enabled = true;
            this.enableFunction();
        }
    }

    buy () {
        this.bought = true;
    }

    disable () {
        if (this.enabled) {
            this.enabled = false;
            this.disableFunction();
        }
    }
}

class Hero {
    constructor (player) {
        this.player = player;
        this.level = 1;
        this.damageToCollectionRatio = 1;
        this.baseDamage = 10;
        this.damageMultiplier = 1;
        this.baseCollection = 4;
        this.collectionMultiplier = 1;
        this.weapons = [];

        this.setUpWeapons();
    }

    get damage() {
        let base = this.baseDamage;
        let multiplier = 1;
        multiplier *= this.damageToCollectionRatio;
        return base * multiplier;
    }

    get collection () {
        let base = this.baseCollection;
        let multiplier = this.player.collectionMultiplier;
        multiplier *= 1 - this.damageToCollectionRatio;
        return base * multiplier;
    }

    setUpWeapons () {
        this.weapons.push(new Item(
            this,
            'Pickaxe',
            'Increases damage by 3',
            10,
            () => this.baseDamage += 3,
            () => this.baseDamage -= 3
        ));
        this.weapons.push(new Item(
            this,
            'Sword',
            'Increases damage by 5',
            25,
            () => this.baseDamage += 5,
            () => this.baseDamage -= 5
        ));
        this.weapons.push(new Item(
            this,
            'Spear',
            'Increases damage by 10',
            150,
            () => this.baseDamage += 10,
            () => this.baseDamage -= 10
        ));
        this.weapons.push(new Item(
            this,
            'Rocket Launcher',
            'Increases damage by 25',
            500,
            () => this.baseDamage += 25,
            () => this.baseDamage -= 25
        ));
        this.weapons.push(new Item(
            this,
            'BFG',
            'Increases damage by 40',
            1500,
            () => this.baseDamage += 40,
            () => this.baseDamage -= 40
        ));
        this.weapons.push(new Item(
            this,
            'Large BFG',
            'Increases damage by 70',
            8000,
            () => this.baseDamage += 70,
            () => this.baseDamage -= 70
        ));
        this.weapons.push(new Item(
            this,
            'Sickle',
            'Increases collection by 1',
            10,
            () => this.baseCollection += 1,
            () => this.baseCollection -= 1
        ));
        this.weapons.push(new Item(
            this,
            'Rake',
            'Increases collection by 3',
            30,
            () => this.baseCollection += 3,
            () => this.baseCollection -= 3
        ));
        this.weapons.push(new Item(
            this,
            'Super Rake',
            'Increases collection by 5',
            200,
            () => this.baseCollection += 5,
            () => this.baseCollection -= 5
        ));
        this.weapons.push(new Item(
            this,
            'Mega Rake',
            'Increases collection by 10',
            750,
            () => this.baseCollection += 10,
            () => this.baseCollection -= 10
        ));
        this.weapons.push(new Item(
            this,
            'Giga Rake',
            'Increases collection by 20',
            2500,
            () => this.baseCollection += 20,
            () => this.baseCollection -= 20
        ));
        this.weapons.push(new Item(
            this,
            'Ultimate Rake',
            'Increases collection by 40',
            12500,
            () => this.baseCollection += 40,
            () => this.baseCollection -= 40
        ));
        this.weapons.push(new Item(
            this,
            'Scythe',
            'Increases damage by 5 and collection by 3',
            40,
            () => { this.baseDamage += 5; this.baseCollection += 3; },
            () => { this.baseDamage -= 5; this.baseCollection -= 3; },
        ));
        this.weapons.push(new Item(
            this,
            'Magnetic Sword',
            'Increases damage by 15 and collection by 8',
            600,
            () => { this.baseDamage += 15; this.baseCollection += 8; },
            () => { this.baseDamage -= 15; this.baseCollection -= 8; },
        ));
        this.weapons.push(new Item(
            this,
            'Pocket Black Hole',
            'Increases damage by 50 and collection by 30',
            10000,
            () => { this.baseDamage += 50; this.baseCollection += 30; },
            () => { this.baseDamage -= 50; this.baseCollection -= 30; },
        ));
    }
}

class Player {
    constructor (game) {
        this.game = game;
        this.highScore = null;
        this.heroes = [];
        this.buildings = [];
        this.passives = [];
        this.actives = [];
        
        this.gold = 0;
        this.collectionMultiplier = 1;
        this.damageToCollectionRatioSliderGranularity = 2;
    }

    get nextHeroCost () {
        const baseCost = 100;
        const scalingFactor = 100;
        const scalingExponent = 2;
        const scalingCost = scalingFactor * Math.pow(scalingExponent, this.heroes.length); 
        return baseCost + scalingCost;
    }

    addHero (hero) {
        hero.player = this;
        this.heroes.push(hero);
    }
}

class PassiveSkill {
    constructor (name, description, cost, enableFunction) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.enableFunction = enableFunction;
        this.enabled = false;
        this.bought = false;
    }

    enable () {
        this.enabled = true;
        this.enableFunction();
    }

    buy () {
        this.bought = true;
        this.enable();
    }
}

class Building {
    constructor (name, description, cost, enableFunction) {
        this.name = name;
        this.description = description;
        this.cost = cost;
        this.enableFunction = enableFunction;
        this.enabled = false;
        this.bought = false;
    }

    enable () {
        this.enabled = true;
        this.enableFunction();
    }

    buy () {
        this.bought = true;
        this.enable();
    }
}

class Game {
    constructor () {
        this.renderer = new GameRenderer(this);

        this.player = new Player();
        const hero = new Hero();
        this.addHero(hero);
        this.gold = 0;

        this.startTime = null;
        this.interval = null;
        this.updateFrequency = 50;
        this.lastUpdate = new Date();
        
        this.setUpPassives();
        this.setUpBuildings();
    }

    setUpPassives() {
        this.player.passives.push(new PassiveSkill(
            'Gathering - Level 1',
            'Increases collection by 25%',
            100,
            () => {
                this.player.collectionMultiplier *= 1.25;
            }
        ));
        this.player.passives.push(new PassiveSkill(
            'Gathering - Level 2',
            'Increases collection by 25%',
            500,
            () => {
                this.player.collectionMultiplier *= 1.25;
            }
        ));
        this.player.passives.push(new PassiveSkill(
            'Gathering - Level 3',
            'Increases collection by 25%',
            2000,
            () => {
                this.player.collectionMultiplier *= 1.25;
            }
        ));
        this.player.passives.push(new PassiveSkill(
            'Gathering - Level 4',
            'Increases collection by 25%',
            5000,
            () => {
                this.player.collectionMultiplier *= 1.25;
            }
        ));
        this.player.passives.push(new PassiveSkill(
            'Specialism - Level 1',
            'Increases the granularity of the hero work sliders by 1',
            75,
            () => {
                this.player.damageToCollectionRatioSliderGranularity += 1;
            }
        ));
        this.player.passives.push(new PassiveSkill(
            'Specialism - Level 2',
            'Increases the granularity of the hero work sliders by 2',
            250,
            () => {
                this.player.damageToCollectionRatioSliderGranularity += 2;
            }
        ));
        this.player.passives.push(new PassiveSkill(
            'Specialism - Level 3',
            'Increases the granularity of the hero work sliders by 4',
            400,
            () => {
                this.player.damageToCollectionRatioSliderGranularity += 4;
            }
        ));

        this.renderer.addPassives();
    }

    setUpBuildings() {
        this.player.buildings.push(new Building(
            'Time Machine',
            'You win the game',
            500000,
            () => {
                this.win();
            }
        ));

        this.renderer.addBuildings();
    }
    
    addHero (hero) {
        this.player.addHero(hero);
        this.renderer.addHero(hero);
    }

    buyHero () {
        if (this.player.gold >= this.player.nextHeroCost) {
            this.player.gold -= this.player.nextHeroCost;
            const hero = new Hero();
            this.addHero(hero);
        }
    }

    buyItem (item) {
        if (item.bought && !item.enabled) {
            item.enable();
            this.renderer.enableItem(item);
        } else if (!item.bought && this.player.gold >= item.cost) {
            this.player.gold -= item.cost;
            item.buy();
            item.enable();
            this.renderer.buyItem(item);
            this.renderer.enableItem(item);
        }
    }

    buyBuilding (building) {
        if (!building.bought && this.player.gold >= building.cost) {
            this.player.gold -= building.cost;
            building.buy();
            this.renderer.buyBuilding(building);
        }
    }

    buyPassive (passive) {
        if (!passive.bought && this.player.gold >= passive.cost) {
            this.player.gold -= passive.cost;
            passive.buy();
            this.renderer.buyPassive(passive);
        }
    }

    setHeroDamageToCollectionRatio(hero, ratio) {
        const granularity = 1 / (this.player.damageToCollectionRatioSliderGranularity - 1);
        hero.damageToCollectionRatio = Math.round(ratio / granularity) * granularity;
        this.renderer.updateHero(hero);
    }

    dealDamage () {
        this.player.heroes.forEach(hero => {
            const damage = hero.damage * this.updateFrequency / 1000;
            this.gold += damage;
        });
    }

    updateCollection () {
        this.player.heroes.forEach(hero => {
            const potentialCollection = hero.collection * this.updateFrequency / 1000;
            if (this.gold >= potentialCollection) {
                this.player.gold += potentialCollection;
                this.gold -= potentialCollection;
            } else {
                this.player.gold += this.gold;
                this.gold = 0;
            }
        });
    }

    update () {
        let timeSinceLastUpdate = new Date() - this.lastUpdate;
        while (timeSinceLastUpdate > this.updateFrequency) {
            timeSinceLastUpdate -= this.updateFrequency;
            this.lastUpdate.setTime(this.lastUpdate.getTime() + this.updateFrequency);
            this.dealDamage();
            this.updateCollection();
        }

        this.renderer.drawResources();
        this.renderer.drawTimer();
    }

    start () {
        this.startTime = new Date();
        this.renderer.startGame();

        this.interval = setInterval(() => {
            this.update();
        }, this.updateFrequency);
    }

    win() {
        const score = new Date() - this.startTime;
        if (!this.highScore || this.highScore > score) {
            this.highScore = score;
        }
        this.renderer.drawHighScore();
        this.stop();
    }

    stop () {
        clearInterval(this.interval);
        this.renderer.unload();
    }
}

class UIElement {
    constructor(gameElement, domElement) {
        this.gameElement = gameElement;
        this.domElement = domElement;
    }
}

class GameRenderer {
    constructor (game) {
        this.game = game;
        this.domGameContainer = document.getElementById('game');
        this.domGameGold = document.getElementById("game-gold");
        this.domPlayerGold = document.getElementById("player-gold");

        this.domTimer = document.getElementById('timer');
        this.domHighScore = document.getElementById('high-score');
        this.domHighScoreContainer = document.getElementById('high-score-container');

        this.domHeroDetails = document.getElementById('hero-details');
        this.domItems = document.getElementById('items');
        
        this.domHeroesContainer = document.getElementById("heroes");
        this.domBuilingsContainer = document.getElementById("buildings");
        this.domPassivesContainer = document.getElementById("passives");

        this.domHeroesTabButton = document.getElementById('heroes-tab-button');
        this.domBuildingsTabButton = document.getElementById('buildings-tab-button');
        this.domPassivesTabButton = document.getElementById('passives-tab-button');
        this.domActivesTabButton = document.getElementById('actives-tab-button');
        this.domTabButtons = [this.domHeroesTabButton, this.domBuildingsTabButton, this.domPassivesTabButton, this.domActivesTabButton];

        this.domHeroesTab = document.getElementById('heroes-tab');
        this.domBuildingsTab = document.getElementById('buildings-tab');
        this.domPassivesTab = document.getElementById('passives-tab');
        this.domActivesTab = document.getElementById('actives-tab');
        this.domTabs = [this.domHeroesTab, this.domBuildingsTab, this.domPassivesTab, this.domActivesTab];

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
        this.domGameContainer.style.display = 'flex';
        this.closeHeroDetails();
        this.selectHeroesTab();
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

    drawGameGold () {
        this.domGameGold.innerHTML = Math.floor(this.game.gold);
    }

    drawPlayerGold () {
        this.domPlayerGold.innerHTML = Math.floor(this.game.player.gold);
    }

    drawResources () {
        this.drawGameGold();
        this.drawPlayerGold();
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

    selectHeroesTab() {
        this.selectTab(this.domHeroesTabButton, this.domHeroesTab);
    }

    selectBuildingsTab() {
        this.selectTab(this.domBuildingsTabButton, this.domBuildingsTab);
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
        // this.removeChildren(this.domHeroesContainer);
        // this.removeChildren(this.domBuilingsContainer);
        // this.removeChildren(this.domPassivesContainer);

        this.domPlayerGold.innerHTML = 0;
        this.domGameGold.innerHTML = 0;

        this.domTimer.innerHTML = '';

        this.domGameContainer.style.display = 'none';
    }
}

function setUpEvents () {
    document.getElementById('new-hero-button').addEventListener('click', () => game.buyHero());
    document.querySelector('#hero-details .close-button').addEventListener('click', () => game.renderer.closeHeroDetails());
    document.getElementById('heroes-tab-button').addEventListener('click', () => game.renderer.selectHeroesTab());
    document.getElementById('buildings-tab-button').addEventListener('click', () => game.renderer.selectBuildingsTab());
    document.getElementById('passives-tab-button').addEventListener('click', () => game.renderer.selectPassivesTab());
    document.getElementById('actives-tab-button').addEventListener('click', () => game.renderer.selectActivesTab());
}

function init() {
    setUpEvents();
}

function newGame() {
    if(game) {
        game.stop();
    }
    //document.getElementById('game').style.display = 'flex';
    game = new Game();
    game.start();
}

let game;

init();