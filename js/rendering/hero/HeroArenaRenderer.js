class HeroArenaRenderer extends GameRenderer {
    constructor (game) {
        super("HeroArenaRenderer", game);
        
        this.domArenasContainer = document.getElementById("hero-arena-arenas");
        this.arenas = [];

        this.setUpEventListeners();
        this.setUpDomEvents();

        this.redrawArenas();
    }

    setUpEventListeners() {
    }

    setUpDomEvents() {
    }

    redrawArenas() {
        this.removeChildren(this.domArenasContainer);

        this.arenas = [];
        this.game.player.heroSystem.heroArenas
            .filter(arena => arena.enabled)
            .forEach(arena => {
                const newDomElement = this.cloneTemplate('.arena');
                this.domArenasContainer.appendChild(newDomElement);
                const uiArena = new UIElement(arena, newDomElement);
                this.arenas.push(uiArena);

                newDomElement.querySelector('.name').innerHTML = arena.name;
                newDomElement.querySelector('.image').src = 'img/hero/arenas/' + arena.name + '.png';
                newDomElement.querySelector('.description').innerHTML = arena.description;
                newDomElement.querySelector('.level').innerHTML = arena.level;

                newDomElement.addEventListener('click', () => this.game.player.heroSystem.enterArena(arena));
            });
    }
}                   