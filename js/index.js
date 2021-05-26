const container = $('.container');
const mainMenu = $('.main-menu');
const infoContainer = $('#game-info');
const controls = $('#game-controls');
const gameScreen = $('#screen');
const playBtn = $('#play-btn');
const createBtn = $('#create-btn');
const savedBtn = $('#saved-btn');

//const game1 = new DaveGame(container);
const game = new DaveGame(container);

infoContainer.innerHTML = game.getInformation();
controls.innerHTML = game.getHelp();

playBtn.addEventListener('click', function (e) {
	game.play();
});

createBtn.addEventListener('click', function () {
	game.createPlayground();
});

savedBtn.addEventListener('click', function () {
	game.showSaved();
});

game.onReturnBack = function () {
	mainMenu.style.display = 'block';
};
