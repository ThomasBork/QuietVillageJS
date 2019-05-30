class HeroArena extends GameObject {
    constructor (options) {
        super(options);
        var defaults = {
            name: "No name",
            description: "No description",
            level: 1,
            monsterTypes: []
        };
        
        const settings = Utils.extend( defaults, options );
        Object.keys(settings).forEach(key => this[key] = settings[key]);

        this.currentMonster = null;
        this.currentHero = null;

        this.onHeroDeath = new Observable();
    }

    enter (hero) {
        this.currentHero = hero;
        this.currentHero.resetAttackCooldown();
        this.spawnMonster();
    }

    leave () {
        this.currentHero = null;
    }

    spawnMonster () {
        const monsterType = Utils.randomElement(this.monsterTypes);
        const monster = new HeroArenaMonster({
            name: monsterType.name,
            baseAttributes: Utils.clone(monsterType.attributes),
            level: Utils.randomInt(this.level, this.level + 2)
        });
        this.currentMonster = monster;
        console.log("Spawning", monster);
    }

    update (dTime) {
        this.updateCharacterAttack(dTime, this.currentHero, this.currentMonster);
        if (this.currentMonster.isAlive) {
            this.updateCharacterAttack(dTime, this.currentMonster, this.currentHero);
            if (!this.currentHero.isAlive) {
                this.onHeroDeath.notify();
            }
        } else {
            this.spawnMonster();
        }
    }

    updateCharacterAttack(dTime, attackingCharacter, attackedCharacter) {
        attackingCharacter.attackCooldown -= dTime / 1000;
        while (attackingCharacter.attackCooldown <= 0 && attackedCharacter.isAlive) {
            attackingCharacter.attackCooldown += attackingCharacter.attributes[HERO_ATTRIBUTE_TYPE.SPEED];

            const damageDealt = attackingCharacter.attributes[HERO_ATTRIBUTE_TYPE.DAMAGE];
            const damageTaken = damageDealt;

            attackedCharacter.currentHealth -= damageTaken;
        }
    }
}
