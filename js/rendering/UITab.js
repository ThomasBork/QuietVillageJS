class UITab {
    constructor (name, domTab, domButton){
        this.name = name;
        this.domTab = domTab;
        this.domButton = domButton;
        this.enabled = false;
    }

    enable () {
        this.enabled = true;
        this.domButton.classList.add('enabled');
    }

    disable () {
        this.enableb = false;
        this.domButton.classList.remove('enabled');
    }

    select () {
        this.domTab.classList.add('selected');
        this.domButton.classList.add('selected');
    }

    deselect () {
        this.domTab.classList.remove('selected');
        this.domButton.classList.remove('selected');
    }

    getObjectToSave () {
        return {
            name: this.name,
            enabled: this.enabled
        };
    }
}