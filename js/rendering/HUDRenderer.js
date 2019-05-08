class HUDRenderer extends GameRenderer {
    constructor (game) {
        super("HUDRenderer", game);

        this.domGameContainer = document.getElementById('game');
        this.domVersion = document.getElementById('version');
        this.domTimer = document.getElementById('timer');
        this.domHighScore = document.getElementById('high-score');
        this.domHighScoreContainer = document.getElementById('high-score-container');

        // Tabs
        this.workersTab = new UITab ('Workers', document.getElementById('workers-tab'), document.getElementById('workers-tab-button'));
        this.buildingsTab = new UITab ('Buildings', document.getElementById('buildings-tab'), document.getElementById('buildings-tab-button'));
        this.cultureTab = new UITab ('Culture', document.getElementById('culture-tab'), document.getElementById('culture-tab-button'));
        this.upgradesTab = new UITab ('Upgrades', document.getElementById('upgrades-tab'), document.getElementById('upgrades-tab-button'));
        this.researchTab = new UITab ('Research', document.getElementById('research-tab'), document.getElementById('research-tab-button'));
        this.activesTab = new UITab ('Actives', document.getElementById('actives-tab'), document.getElementById('actives-tab-button'));

        this.tabs = [
            this.workersTab,
            this.buildingsTab,
            this.cultureTab,
            this.upgradesTab,
            this.researchTab,
            this.activesTab
        ];

        this.currentTab = null;

        this.setUpEventListeners();
        this.setUpDomEvents();
        
        this.selectTab(this.workersTab);
        this.domVersion.innerHTML = 'v' + SaveGame.currentVersion;
    }

    setUpEventListeners() {
        this.game.onStart.addSubscription(this.onStartGame, this);
        this.game.onUpdate.addSubscription(this.onUpdateGame, this);
        this.game.onWin.addSubscription(this.onWinGame, this);

        Data.jobs.woodcutter.onChangeWorkerCount.addSubscription(amount => {
            if (amount > 0) {
                this.buildingsTab.enable();
            }
        });

        Data.buildings.hut.onBuy.addSubscription(amount => {
            if (amount >= 3) {
                this.upgradesTab.enable();
            }
        });

        Data.upgrades.researchTent.onBuy.addSubscription(() => this.researchTab.enable());
    }

    setUpDomEvents() {
        this.tabs.forEach(tab => tab.domButton.addEventListener('click', () => this.selectTab(tab)));
    }

    onStartGame () {
        this.resetHoverInfoHoverFuntions();

        //this.domGameContainer.style.display = 'flex';
    }

    onUpdateGame () {
        //this.drawTimer();
    }

    onWinGame () {
        this.drawHighScore();
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

    selectTab(tab) {
        if (!tab.enabled) {
            tab.enable();
        }
        this.tabs.forEach(t => t.deselect());
        tab.select();
        this.currentTab = tab;
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

    unload () {
        super.unload();
        
        //this.domTimer.innerHTML = '';

        this.domGameContainer.style.display = 'none';

        this.tabs.forEach(tab => tab.disable());
    }


    getObjectToSave() {
        return {
            tabs: this.tabs.map(tab => tab.getObjectToSave()),
            currentTab: this.currentTab.getObjectToSave()
        };
    }

    loadStateFromObject (object) {
        object.tabs.forEach(tabObj => {
            if (tabObj.enabled) {
                const tab = this.tabs.find(tab => tab.name === tabObj.name);
                tab.enable();
            }
        });

        const currentTab = this.tabs.find(tab => tab.name === object.currentTab.name);
        this.selectTab(currentTab);
    }
}