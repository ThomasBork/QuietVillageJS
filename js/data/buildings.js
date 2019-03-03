Data.initBuildings = (player) => {
    Data.buildings = {
        hut: new Building({
            name: 'Hut',
            description: 'Allows another worker to join the village',
            cost: {'Wood': 10},
            buyFunction: () => {
                player.addWorkers(1);
            }
        }),
        woodShed: new Building({
            name: 'Wood Shed',
            description: 'Can store more wood',
            cost: {'Wood': 200},
            costAmountPowerBase: 1,
            costAmountMultiplier: 80
        })
    }

    player.buildings = Object.values(Data.buildings);
}