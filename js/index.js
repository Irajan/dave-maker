const container = $('.container');
const infoContainer = $('#game-info');
const controls = $('#game-controls');
const gameScreen = $('#screen');
const playBtn = $('#play-btn');
const createBtn = $('#create-btn');

const game = new DaveGame(container);

infoContainer.innerHTML = game.getInformation();
controls.innerHTML = game.getHelp();

playBtn.addEventListener('click', function (e) {
	this.parentNode.removeChild(this);
	game.play();
});

createBtn.addEventListener('click', function () {
	this.parentNode.removeChild(this);
	game.createPlayground();
});
