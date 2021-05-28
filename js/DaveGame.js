function loadSprite() {
	return new Promise(function (resolve, reject) {
		const img = new Image();
		img.src = './assets/sprite.png';
		img.onload = resolve(img);
	});
}

class DaveGame {
	static possibleControlKeys = new Array().concat(CONTROLLER_KEYS);

	constructor(container) {
		//If no control keys are available than return
		if (DaveGame.possibleControlKeys.length === 0) return;

		this.gameUi = new GameUI(container);
		this.highScore = 0;
		this.controlKeys = DaveGame.possibleControlKeys.shift();
		this.assets = {};
		this.spriteMap = null;
		this.groundGenerator;

		(async () => {
			this.assets.sprites = await loadSprite();
			this.spriteMap = new SpriteMap(this.assets.sprites);
		})();
	}

	getInformation() {
		return 'The objective of the game is to collect gold cups to move on to the next level.';
	}

	getHelp() {
		return `<ul class="control-list">
              <li class="control-list__item">
			  		<img src="${this.controlKeys.img.left}" alt="${this.controlKeys.left}"> 
					<div class="control-text">to move left </div>
			  </li>
              <li class="control-list__item">
			  		<img src="${this.controlKeys.img.right}" alt="${this.controlKeys.right}"> 
					  <div class="control-text">to move right</div>
			  </li>
              <li class="control-list__item">
			  		<img src="${this.controlKeys.img.up}" alt="${this.controlKeys.up}"> 
					  <div class="control-text">to jump </div>
			  </li>
              <li class="control-list__item">
			  		<img src="${this.controlKeys.img.shoot}" alt="${this.controlKeys.shoot}"> 
					  <div class="control-text">to shoot</div>
			  </li>
            </ul>
    `;
	}

	play(playGround) {
		const gameController = new GameController(this.gameUi, this.spriteMap);
		gameController.init(playGround, this.controlKeys);
		gameController.start();
		gameController.afterGameOver = afterGameOver.bind(this);

		function afterGameOver() {
			const playerScore = gameController.getScore();

			if (playerScore > this.highScore) {
				this.highScore = playerScore;
			}

			this.gameUi.showAlert(
				`Game Over
				 <p>You managed to score ${playerScore} <p>
				<p>High Score : ${this.highScore}</p>
				 `
			);

			this.gameUi.showMenu();
		}
	}

	createPlayground() {
		if (this.groundGenerator == null) {
			this.groundGenerator = new GroundGenerator(this.spriteMap, this.gameUi);
		}
		this.groundGenerator.init();
		this.groundGenerator.onFinish = this.play.bind(this);
	}
}
