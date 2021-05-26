class GameController {
	constructor(canvas, sprites, callback) {
		this.score = 0;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.afterGameOver = callback;
		this.currentLevel = 0;
		this.playGround;
		this.player = null;
		this.monster = null;
		this.maxLevel = 1;

		this.sprites = sprites;
		this.controlKeys = null;
		this.playerLife = 3;
	}

	init(playGround, controlKeys) {
		this.playGround = playGround || new PlayGround(this.sprites);
		this.playGround.show(this.ctx);

		this.controlKeys = controlKeys;

		this.player = new Player(this.playGround);

		if (this.playGround.monsterPosition != null) {
			this.monster = new Monster(this.playGround);

			this.monster.setEnemy(this.player);
			this.player.setEnemy(this.monster);

			this.monster.init();
		}

		window.addEventListener('keydown', this.keyboardInputHandler);
	}

	keyboardInputHandler = (e) => {
		switch (e.code) {
			case this.controlKeys.up:
				this.player.jump();
				break;
			case this.controlKeys.left:
				this.player.moveLeft();
				break;
			case this.controlKeys.right:
				this.player.moveRight();
				break;
			case this.controlKeys.shoot:
				this.player.shoot();
				break;
			default:
				return;
		}
	};

	start() {
		const playerStatus = this.player.getStatus();
		const id = requestAnimationFrame(this.start.bind(this));

		if (playerStatus.reachedDoor) {
			window.removeEventListener('keydown', this.keyboardInputHandler);
			cancelAnimationFrame(id);
			this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
			this.upgradeLevel();
		}

		if (playerStatus.eatenFood.status) {
			this.score += playerStatus.eatenFood.value;
			this.player.gotFood = false;
		}

		if (playerStatus.died) {
			window.removeEventListener('keydown', this.keyboardInputHandler);
			cancelAnimationFrame(id);
			let count = 1;
			const interval = setInterval(() => {
				this.player.draw(this.ctx, count);
				count--;

				if (count < 0) {
					clearInterval(interval);
					this.ctx.clearRect(
						this.player.x,
						this.player.y,
						GRID_WIDTH,
						GRID_HEIGHT
					);
					this.player.resetPosition();
					this.player.isDead = false;

					if (--this.playerLife < 0) {
						this.gameOver();
						return;
					}

					this.player.draw(this.ctx);
					window.addEventListener('keydown', this.keyboardInputHandler);
					this.start();
				}
			}, SPEED * 100);
		}
	}

	upgradeLevel() {
		if (++this.currentLevel == this.maxLevel) {
			this.gameOver();
			return;
		}

		this.playGround.upgrade(this.currentLevel, afterUpgrade.bind(this));

		function afterUpgrade() {
			this.player = new Player(this.playGround);
			window.addEventListener('keydown', this.keyboardInputHandler);
			this.start();
		}
	}

	getScore() {
		return this.score;
	}

	gameOver() {
		alert('Game Over');
		this.afterGameOver();
	}
}
