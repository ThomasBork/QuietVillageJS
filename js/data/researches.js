Data.initResearches = (player) => {
    Data.researches = {
        fire: new Research({
            name: 'Fire',
            description: 'Burns',
            researchRequired: 100
        }),
        ice: new Research({
            name: 'Ice',
            description: 'Chills',
            researchRequired: 300
        })
    };

    player.researches = Object.values(Data.researches);
}