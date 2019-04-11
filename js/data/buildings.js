Data.initBuildings = (player) => {
    Data.buildings = {
        hut: new Building({
            name: 'Hut',
            description: 'Allows another worker to join the village',
            cost: {'Wood': 10},
            costAmountPowerBase: 1.5,
            buyFunction: () => {
                player.addWorkers(1);
            }
        }),
        lumberMill: new Building({
            name: 'Lumber Mill',
            description: 'Increases the efficiency of the woodcutter job by 10%',
            cost: {'Wood': 100},
            costAmountPowerBase: 1.2,
            costAmountMultiplier: 50
        }),
        woodShed: new Building({
            name: 'Wood Shed',
            description: 'Can store more wood',
            cost: {'Wood': 200},
            costAmountPowerBase: 1,
            costAmountMultiplier: 80
        }),
        stoneQuarry: new Building ({
            name: 'Stone Quarry',
            description: 'Increases the efficiency of the stonecutter job by 25%',
            cost: {'Wood': 400, 'Pelt': 100},
            costAmountPowerBase: 2
        }),
        church: new Building ({
            name: 'Church',
            description: 'Increases the efficiency of the priest job by 10%',
            cost: {'Wood': 400, 'Stone': 100},
            costAmountPowerBase: 1.3
        })
    }

    player.buildings = Object.values(Data.buildings);
}