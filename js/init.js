function setUpEvents () {
    document.getElementById('new-hero-button').addEventListener('click', () => game.buyHero());
    document.querySelector('#hero-details .close-button').addEventListener('click', () => game.renderer.closeHeroDetails());
    document.getElementById('workers-tab-button').addEventListener('click', () => game.renderer.selectWorkersTab());
    document.getElementById('buildings-tab-button').addEventListener('click', () => game.renderer.selectBuildingsTab());
    document.getElementById('heroes-tab-button').addEventListener('click', () => game.renderer.selectHeroesTab());
    document.getElementById('passives-tab-button').addEventListener('click', () => game.renderer.selectPassivesTab());
    document.getElementById('actives-tab-button').addEventListener('click', () => game.renderer.selectActivesTab());
}

function init() {
    setUpEvents();
}

function newGame() {
    if(game) {
        game.stop();
    }
    game = new Game();
    game.start();
}

let game;

init();