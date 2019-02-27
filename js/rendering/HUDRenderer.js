class HUDRenderer extends GameRenderer {
    constructor (game) {
        super(game);
        this.game = game;

        this.domGameContainer = document.getElementById('game');
        this.domTimer = document.getElementById('timer');
        this.domHighScore = document.getElementById('high-score');
        this.domHighScoreContainer = document.getElementById('high-score-container');

        // Tabs
        this.domBuildingsTabButton = document.getElementById('buildings-tab-button');
        this.domWorkersTabButton = document.getElementById('workers-tab-button');
        this.domHeroesTabButton = document.getElementById('heroes-tab-button');
        this.domPassivesTabButton = document.getElementById('passives-tab-button');
        this.domActivesTabButton = document.getElementById('actives-tab-button');
        this.domTabButtons = [this.domWorkersTabButton, this.domBuildingsTabButton, this.domHeroesTabButton, this.domPassivesTabButton, this.domActivesTabButton];

        this.domBuildingsTab = document.getElementById('buildings-tab');
        this.domWorkersTab = document.getElementById('workers-tab');
        this.domHeroesTab = document.getElementById('heroes-tab');
        this.domPassivesTab = document.getElementById('passives-tab');
        this.domActivesTab = document.getElementById('actives-tab');
        this.domTabs = [this.domWorkersTab, this.domBuildingsTab, this.domHeroesTab, this.domPassivesTab, this.domActivesTab];

        this.setUpEventListeners();
        this.setUpDomTabButtonEvents();
        this.updateEnabledTabs();
        
        this.selectBuildingsTab();
    }

    setUpEventListeners() {
        this.game.onStart.addSubscription(this.onStartGame, this);
        this.game.onUpdate.addSubscription(this.onUpdateGame, this);
        this.game.onWin.addSubscription(this.onWinGame, this);
    }

    setUpDomTabButtonEvents () {
        this.domBuildingsTabButton.addEventListener('click', () => this.selectBuildingsTab());
        this.domWorkersTabButton.addEventListener('click', () => this.selectWorkersTab());
        this.domHeroesTabButton.addEventListener('click', () => this.selectHeroesTab());
        this.domPassivesTabButton.addEventListener('click', () => this.selectPassivesTab());
        this.domActivesTabButton.addEventListener('click', () => this.selectActivesTab());
    }

    onStartGame () {
        this.resetHoverInfoHoverFuntions();

        this.domGameContainer.style.display = 'flex';
    }

    onUpdateGame () {
        this.drawTimer();
        this.updateEnabledTabs();
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

    updateEnabledTabs() {
        this.domTabButtons.forEach(t => t.classList.remove('enabled'));

        if (this.game.player.buildings.some(b => b.enabled)) {
            this.enableTabButton(this.domBuildingsTabButton);
        }

        if (this.game.player.workerCount > 0) {
            this.enableTabButton(this.domWorkersTabButton);
        }
    }

    enableTabButton(tabButton) {
        tabButton.classList.add('enabled');
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
        
        this.domTimer.innerHTML = '';

        this.domGameContainer.style.display = 'none';
    }
}