class DaveGame {
	static possibleControlKeys = new Array().concat(CONTROLLER_KEYS);

	constructor(container) {
		//If no control keys are available than return
		if (DaveGame.possibleControlKeys.length === 0) return;

		this.container = container;
		this.highScore = 0;
		this.controlKeys = DaveGame.possibleControlKeys.shift();
		this.assets = {};
		this.spriteMap = null;

		(async () => {
			this.assets.sprites = await loadSprite();
			this.spriteMap = new SpriteMap(this.assets.sprites);
		})();

		function loadSprite() {
			return new Promise(function (resolve, reject) {
				const img = new Image();
				img.src = './assets/sprite.png';
				img.onload = resolve(img);
			});
		}
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
		const canvas = document.createElement('canvas');
		this.container.innerHTML = '';

		canvas.width = GRID_WIDTH * 19;
		canvas.height = GRID_HEIGHT * 10;
		container.appendChild(canvas);

		const gameController = new GameController(
			canvas,
			this.spriteMap,
			afterGameOver.bind(this)
		);
		gameController.init(playGround, this.controlKeys);
		gameController.start();

		function afterGameOver() {
			const playerScore = gameController.getScore();

			if (playerScore > this.highScore) {
				this.highScore = playerScore;
			}
			console.log(this.highScore);
		}
	}

	createPlayground() {
		const generator = new GroundGenerator(this.spriteMap, this.container);
		generator.init();
		generator.onFinish = this.play.bind(this);
	}
}
