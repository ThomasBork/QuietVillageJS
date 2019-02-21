Data.initPassives = (player) => {
    player.passives.push(new PassiveSkill(
        'Gathering - Level 1',
        'Increases collection by 25%',
        100,
        () => {
            player.collectionMultiplier *= 1.25;
        }
    ));
    player.passives.push(new PassiveSkill(
        'Gathering - Level 2',
        'Increases collection by 25%',
        500,
        () => {
            player.collectionMultiplier *= 1.25;
        }
    ));
    player.passives.push(new PassiveSkill(
        'Gathering - Level 3',
        'Increases collection by 25%',
        2000,
        () => {
            player.collectionMultiplier *= 1.25;
        }
    ));
    player.passives.push(new PassiveSkill(
        'Gathering - Level 4',
        'Increases collection by 25%',
        5000,
        () => {
            player.collectionMultiplier *= 1.25;
        }
    ));
    player.passives.push(new PassiveSkill(
        'Specialism - Level 1',
        'Increases the granularity of the hero work sliders by 1',
        75,
        () => {
            player.damageToCollectionRatioSliderGranularity += 1;
        }
    ));
    player.passives.push(new PassiveSkill(
        'Specialism - Level 2',
        'Increases the granularity of the hero work sliders by 2',
        250,
        () => {
            player.damageToCollectionRatioSliderGranularity += 2;
        }
    ));
    player.passives.push(new PassiveSkill(
        'Specialism - Level 3',
        'Increases the granularity of the hero work sliders by 4',
        400,
        () => {
            player.damageToCollectionRatioSliderGranularity += 4;
        }
    ));
}