Data.initBuildings = (player) => {
    player.buildings.push(new Building(
        'Hut',
        'Allows another worker to join the village',
        0,
        () => {
            player.workers.count ++;
        }
    ));
    player.buildings.push(new Building(
        'Time Machine',
        'You win the game',
        500000,
        () => {
            player.game.win();
        }
    ));
}