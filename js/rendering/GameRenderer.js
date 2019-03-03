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