class HeroHUDRenderer extends GameRenderer {
    constructor (game) {
        super("HeroHUDRenderer", game);

        // Tabs
        this.profileTab = new UITab ('Profile', document.getElementById('hero-profile-tab'), document.getElementById('hero-profile-tab-button'));
        this.arenaTab = new UITab ('Arena', document.getElementById('hero-arena-tab'), document.getElementById('hero-arena-tab-button'));

        this.tabs = [
            this.profileTab,
            this.arenaTab
        ];

        this.currentTab = null;

        this.setUpEventListeners();
        this.setUpDomEvents();
        
        this.profileTab.enable();
        this.arenaTab.enable();
        this.selectTab(this.profileTab);
    }

    setUpEventListeners() {
    }

    setUpDomEvents() {
        this.tabs.forEach(tab => tab.domButton.addEventListener('click', () => this.selectTab(tab)));
    }

    selectTab(tab) {
        if (!tab.enabled) {
            tab.enable();
        }
        this.tabs.forEach(t => t.deselect());
        tab.select();
        this.currentTab = tab;
    }

    unload () {
        super.unload();

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