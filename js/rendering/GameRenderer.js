class GameRenderer {
    constructor (name, game) {
        this.name = name;
        this.game = game;

        this.domElementsToRemoveAtCleanUp = [];

        this.initGeneralEventListeners();
    }

    initGeneralEventListeners () {
        this.game.onStop.addSubscription(this.onStopGame, this);
    }

    onStopGame() {
        this.unload();
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

    padNumberWithZeroes (number, length) {
        let numberString = '' + number;
        while (numberString.length < length) {
            numberString = '0' + numberString;
        }
        return numberString;
    }

    prettyDuration (timeInMilliseconds) {
        const timeInSeconds = Math.floor(timeInMilliseconds / 1000);
        const seconds = timeInSeconds % 60;
        const minutes = Math.floor(((timeInSeconds - seconds) / 60) % 60);
        const hours = Math.floor(((timeInSeconds - minutes * 60 - seconds) / (60 * 60)) % 24);
        const days = Math.floor(timeInSeconds / (24 * 60 * 60));
        let text = this.padNumberWithZeroes(hours, 2) + ':' 
            + this.padNumberWithZeroes(minutes, 2) + ':' 
            + this.padNumberWithZeroes(seconds, 2);
        if (days > 0) {
            text = days + ' days ' + text;
        }
        return text;
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
    }


    getObjectToSave() {
        return {};
    }

    loadStateFromObject(obj) {

    }
}