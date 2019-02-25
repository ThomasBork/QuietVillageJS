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

        // Workers tab
        this.domIdleWorkers = document.getElementById('idle-workers');
        this.domJobList = document.getElementById('job-list');

        // Misc
        this.resources = [];

        this.jobs = [];
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
    
    prettyNumber (number, maxDecimals, minDecimals, ceil) {
        if (maxDecimals === undefined) {
            maxDecimals = 2;
        }
        if (minDecimals === undefined) {
            minDecimals = maxDecimals;
        }
        if (ceil === undefined) {
            ceil = false;
        }
        const multiplier = Math.pow(10, maxDecimals);
        let roundedNumber;
        if (ceil) {
            number -= 0.0001; // Floating point fix.
            roundedNumber = Math.ceil(number * multiplier) / multiplier;
        } else {
            number += 0.0001; // Floating point fix.
            roundedNumber = Math.floor(number * multiplier) / multiplier;
        }
        if (minDecimals) {
            return roundedNumber.toFixed(minDecimals);
        } else {
            return roundedNumber;
        }
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

    resetHoverInfoHoverFuntions() {
        window.onmousemove = function (event) {
            document.getElementsByClassName('hover-info').forEach(domHover => {
                const boundingRect = domHover.parentElement.getBoundingClientRect();
                const left = event.clientX - boundingRect.x + 10;
                const top = event.clientY - boundingRect.y - 5;
                domHover.style.left = left + 'px';
                domHover.style.top = top + 'px';
            });
        }
    }

    startGame () {
        this.addBuildings();
        this.addPassives();
        this.domGameContainer.style.display = 'flex';
        this.selectBuildingsTab();
        this.resetHoverInfoHoverFuntions();
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
            let text = this.prettyNumber(resource.gameElement.amount, 0) + ' / ' + this.prettyNumber(resource.gameElement.cap, 0);
            if (resource.gameElement.income !== 0) {
                text += ' (' + this.prettyNumber(resource.gameElement.income) + ')';
            }
            valueElement.innerHTML = text;
        });
    }

    onJobEnabled (job) {
        this.redrawJobs();
    }

    redrawJobs () {
        this.removeChildren(this.domJobList);

        this.jobs = [];
        this.game.player.jobs.forEach(job => {
            if (job !== this.game.player.idleJob) {
                const newDomElement = this.cloneTemplate('.job-line');
                this.domJobList.appendChild(newDomElement);
                const uiElement = new UIElement(job, newDomElement);
                this.jobs.push(uiElement);

                const rangeElement = newDomElement.querySelector('.amount-range');
                rangeElement.addEventListener('input', () => this.game.player.setAmountOfWorkersOnJob(job, rangeElement.value));
                rangeElement.addEventListener('change', () => this.game.player.setAmountOfWorkersOnJob(job, rangeElement.value));
            }
        });

        this.updateJobs();
    }

    updateJobs () {
        this.domIdleWorkers.innerHTML = this.game.player.idleJob.workerCount;

        this.jobs.forEach(job => {
            const nameElement = job.domElement.querySelector('.name');
            nameElement.innerHTML = job.gameElement.name;
            const amountElement = job.domElement.querySelector('.amount');
            amountElement.innerHTML = job.gameElement.workerCount;
            const rangeElement = job.domElement.querySelector('.amount-range');
            rangeElement.max = this.game.player.workerCount;
            rangeElement.value = job.gameElement.workerCount;
        });
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
        this.buildings = [];
        this.game.player.buildings.forEach(building => {
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
    }

    buyPassive(passive) {
        const uiPassive = this.passives.find(p => p.gameElement === passive);

        uiPassive.domElement.classList.add('bought');

        this.game.player.heroes.forEach(hero => this.updateHero(hero));
    }

    onBuyBuilding(building) {
        const uibuilding = this.buildings.find(p => p.gameElement === building);

        uibuilding.domElement.classList.add('bought');

        this.game.player.heroes.forEach(hero => this.updateHero(hero));

        this.updateBuildings();
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