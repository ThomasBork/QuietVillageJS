Data.initResearches = (player) => {
    Data.researches = {
        axeSharpener: new Research({
            name: 'Axe Sharpener',
            description: 'Improves the efficiency of the woodcutter job by 10%',
            researchRequired: 150
        }),
        advancedLumbering: new Research({
            name: 'Advanced Lumbering',
            description: 'Enables the production of lumber mills',
            researchRequired: 350
        })
    };

    player.researches = Object.values(Data.researches);
}