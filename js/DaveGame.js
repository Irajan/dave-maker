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
		return 'The objective of the game is to collect gold cups to move on to the next level. Since the original 1988 publishing of Dangerous Dave on UpTime, there have been three sequels and three ports of the original to other platforms.';
	}

	getHelp() {
		return `<ul>
              <li>Press [${this.controlKeys.left}] to move left</li>
              <li>Press [${this.controlKeys.right}] to move right</li>
              <li>Press [${this.controlKeys.up}] to move up</li>
              <li>Press [${this.controlKeys.shoot}] to shoot</li>
            </ul>
    `;
	}

	play(playGround) {
		const canvas = document.createElement('canvas');
		this.container.innerHTML = '';

		canvas.addEventListener('click', function (e) {
			const boundRect = canvas.getBoundingClientRect();
			const x = e.clientX - boundRect.left;
			const y = e.clientY - boundRect.top;

			console.log(x, y);
		});

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
			console.log(playerScore);
		}
	}

	createPlayground() {
		const canvas = document.createElement('canvas');
		this.container.innerHTML = '';

		canvas.addEventListener('click', function (e) {
			const boundRect = canvas.getBoundingClientRect();
			const x = e.clientX - boundRect.left;
			const y = e.clientY - boundRect.top;

			console.log(x, y);
		});

		canvas.width = GRID_WIDTH * 19;
		canvas.height = GRID_HEIGHT * 10;
		container.appendChild(canvas);

		const generator = new GroundGenerator(this.spriteMap, canvas);
	}
}
