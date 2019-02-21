Data.initBuildings = (player) => {
    player.buildings.push(new Building(
        'Time Machine',
        'You win the game',
        500000,
        () => {
            player.game.win();
        }
    ));
}