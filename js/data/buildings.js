Data.initBuildings = (player) => {
    player.buildings.push(new Building(
        'Hut',
        'Allows another worker to join the village',
        {'Wood': 10},
        () => {
            player.addWorkers(1);
        }
    ));
    player.buildings.push(new Building(
        'Barn',
        'Increases supply',
        {'Wood': 10},
        () => {}
    ));
    player.buildings.push(new Building(
        'Time Machine',
        'You win the game',
        {'Gold': 100000},
        () => {
            player.game.win();
        }
    ));
}