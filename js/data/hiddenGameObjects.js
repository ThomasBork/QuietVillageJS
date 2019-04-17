Data.initHiddenGameObjects = (player) => {
    Data.hiddenGameObjects = {
        devotionDecay: new HiddenGameObject()
    }

    player.hiddenGameObjects = Object.values(Data.hiddenGameObjects);
}