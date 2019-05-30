class HeroSystem {
    constructor (player) {
        this.player = player;
        this.hero = null;
        this.heroArenas = [];
        this.currentArena = null;
        this.init();
    }

    init () {
        this.hero = new Hero({
            name: "Johnny", 
            baseAttributes: HeroAttribute.BuildSet({
                HEALTH: 300,
                SPEED: 1,
                DAMAGE: 5
            })
        });
    }

    update (dTime) {
        if (this.currentArena) {
            this.currentArena.update(dTime);
        }
    }

    enterArena (arena) {
        if (this.currentArena) {
            this.leaveArena();
        }
        this.currentArena = arena;
        arena.enter(this.hero);
    }

    leaveArena () {
        this.currentArena = null;
    }
}
