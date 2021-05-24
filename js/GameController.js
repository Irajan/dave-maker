class GameController {
	constructor(canvas, sprites, callback) {
		this.score = 0;
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.afterGameOver = callback;
		this.currentLevel = 0;
		this.playGround;
		this.player = null;
		this.sprites = sprites;
		this.controlKeys = null;
		this.playerLife = 3;
	}

	init(playGround, controlKeys) {
		this.playGround = playGround ?? new PlayGround(this.sprites);
		this.playGround.show(this.ctx);

		this.controlKeys = controlKeys;

		this.player = new Player(this.playGround);
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
				this.player.fallDown();
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
						this.afterGameOver();
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
		this.currentLevel++;
		console.log(this.score);
		this.playGround.upgrade(this.currentLevel, () => {
			this.player = new Player(this.playGround);
			window.addEventListener('keydown', this.keyboardInputHandler);
			this.start();
		});
	}

	getScore() {
		return this.score;
	}

	gameOver() {
		this.afterGameOver();
	}
}
