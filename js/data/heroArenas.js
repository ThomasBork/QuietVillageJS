Data.initHeroArenas = (player) => {
    Data.heroArenas = {
        forest: new HeroArena({
            name: 'Forest',
            description: 'Easy monsters! Weak loot.',
            level: 1,
            monsterTypes: [
                new HeroArenaMonsterType({
                    name: "Goblin",
                    attributes: HeroAttribute.BuildSet({
                        HEALTH: 50,
                        SPEED: 2,
                        DAMAGE: 2
                    })
                }),
                new HeroArenaMonsterType({
                    name: "Horse",
                    attributes: HeroAttribute.BuildSet({
                        HEALTH: 75,
                        SPEED: 1,
                        DAMAGE: 2
                    })
                })
            ]
        }),
        jungle: new HeroArena({
            name: 'Jungle',
            description: 'Strong monsters! Good loot.',
            level: 5,
            monsterTypes: [
                new HeroArenaMonsterType({
                    name: "Cobra",
                    attributes: HeroAttribute.BuildSet({
                        HEALTH: 50,
                        SPEED: 2,
                        DAMAGE: 3
                    })
                }),
                new HeroArenaMonsterType({
                    name: "Lion",
                    attributes: HeroAttribute.BuildSet({
                        HEALTH: 80,
                        SPEED: 2,
                        DAMAGE: 2.5
                    })
                })
            ]
        })
    };

    player.heroSystem.heroArenas = Object.values(Data.heroArenas);
}