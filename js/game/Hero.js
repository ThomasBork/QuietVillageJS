class Hero {
    constructor (player) {
        this.player = player;
        this.level = 1;
        this.damageToCollectionRatio = 1;
        this.baseDamage = 10;
        this.damageMultiplier = 1;
        this.baseCollection = 4;
        this.collectionMultiplier = 1;
        this.weapons = [];

        this.setUpWeapons();
    }

    get damage() {
        let base = this.baseDamage;
        let multiplier = 1;
        multiplier *= this.damageToCollectionRatio;
        return base * multiplier;
    }

    get collection () {
        let base = this.baseCollection;
        let multiplier = this.player.collectionMultiplier;
        multiplier *= 1 - this.damageToCollectionRatio;
        return base * multiplier;
    }

    setUpWeapons () {
        this.weapons.push(new Item(
            this,
            'Pickaxe',
            'Increases damage by 3',
            10,
            () => this.baseDamage += 3,
            () => this.baseDamage -= 3
        ));
        this.weapons.push(new Item(
            this,
            'Sword',
            'Increases damage by 5',
            25,
            () => this.baseDamage += 5,
            () => this.baseDamage -= 5
        ));
        this.weapons.push(new Item(
            this,
            'Spear',
            'Increases damage by 10',
            150,
            () => this.baseDamage += 10,
            () => this.baseDamage -= 10
        ));
        this.weapons.push(new Item(
            this,
            'Rocket Launcher',
            'Increases damage by 25',
            500,
            () => this.baseDamage += 25,
            () => this.baseDamage -= 25
        ));
        this.weapons.push(new Item(
            this,
            'BFG',
            'Increases damage by 40',
            1500,
            () => this.baseDamage += 40,
            () => this.baseDamage -= 40
        ));
        this.weapons.push(new Item(
            this,
            'Large BFG',
            'Increases damage by 70',
            8000,
            () => this.baseDamage += 70,
            () => this.baseDamage -= 70
        ));
        this.weapons.push(new Item(
            this,
            'Sickle',
            'Increases collection by 1',
            10,
            () => this.baseCollection += 1,
            () => this.baseCollection -= 1
        ));
        this.weapons.push(new Item(
            this,
            'Rake',
            'Increases collection by 3',
            30,
            () => this.baseCollection += 3,
            () => this.baseCollection -= 3
        ));
        this.weapons.push(new Item(
            this,
            'Super Rake',
            'Increases collection by 5',
            200,
            () => this.baseCollection += 5,
            () => this.baseCollection -= 5
        ));
        this.weapons.push(new Item(
            this,
            'Mega Rake',
            'Increases collection by 10',
            750,
            () => this.baseCollection += 10,
            () => this.baseCollection -= 10
        ));
        this.weapons.push(new Item(
            this,
            'Giga Rake',
            'Increases collection by 20',
            2500,
            () => this.baseCollection += 20,
            () => this.baseCollection -= 20
        ));
        this.weapons.push(new Item(
            this,
            'Ultimate Rake',
            'Increases collection by 40',
            12500,
            () => this.baseCollection += 40,
            () => this.baseCollection -= 40
        ));
        this.weapons.push(new Item(
            this,
            'Scythe',
            'Increases damage by 5 and collection by 3',
            40,
            () => { this.baseDamage += 5; this.baseCollection += 3; },
            () => { this.baseDamage -= 5; this.baseCollection -= 3; },
        ));
        this.weapons.push(new Item(
            this,
            'Magnetic Sword',
            'Increases damage by 15 and collection by 8',
            600,
            () => { this.baseDamage += 15; this.baseCollection += 8; },
            () => { this.baseDamage -= 15; this.baseCollection -= 8; },
        ));
        this.weapons.push(new Item(
            this,
            'Pocket Black Hole',
            'Increases damage by 50 and collection by 30',
            10000,
            () => { this.baseDamage += 50; this.baseCollection += 30; },
            () => { this.baseDamage -= 50; this.baseCollection -= 30; },
        ));
    }
}