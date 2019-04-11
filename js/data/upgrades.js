Data.initUpgrades = (player) => {
    Data.upgrades = {
        woodenSpear: new Upgrade({
            name: 'Wooden Spear',
            description: 'Enables the hunter job',
            cost: {'Wood': 100}
        }),
        woodenAxe: new Upgrade({
            name: 'Wooden Axe',
            description: 'Increases the efficiency of the woodcutter job by 20%',
            cost: {'Wood': 200}
        }),
        researchTent: new Upgrade({
            name: 'Research Tent',
            description: 'Enables the researcher job',
            cost: {'Wood': 200, 'Pelt': 150}
        }),
        pickaxe: new Upgrade({
            name: 'Pickaxe',
            description: 'Enables the stonecutter job and the construction of quarries',
            cost: {'Wood': 300, 'Pelt': 200}
        }),
        sharpeningStone: new Upgrade({
            name: 'Sharpening Stone',
            description: 'Increases the efficiency of the woodcutter job and the stonecutter job by 25%',
            cost: {'Pelt': 100, 'Stone': 150}
        })
    };

    player.upgrades = Object.values(Data.upgrades);
}