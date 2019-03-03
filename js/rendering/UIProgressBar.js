class UIProgressBar {
    constructor (domContainer, domBar) {
        this.min = 0;
        this.max = 1;
        this.value = 0;
        this.domContainer = domContainer;
        this.domBar = domBar;
    }

    setValue (value) {
        this.value = value;
        const barRatio = (this.value - this.min) / (this.max - this.min);
        this.domBar.style.width = (barRatio * 100) + '%';
    }
}