function afterUpgrade() {
	this.gameUi.setLevel(this.currentLevel);
	this.player = new Player(this.playGround);
	window.addEventListener('keydown', this.keyboardInputHandler);
	this.start();

	if (this.playGround.monsterPosition != null) {
		this.monster = new Monster(this.playGround);

		this.monster.setEnemy(this.player);
		this.player.setEnemy(this.monster);

		this.monster.init();
	}
}

class GameController {
	constructor(gameUi, sprites) {
		this.score = 0;
		this.gameUi = gameUi;
		this.currentLevel = 0;
		this.playGround;
		this.player = null;
		this.monster = null;
		this.maxLevel = 3;

		this.sprites = sprites;
		this.controlKeys = null;
		this.playerLife = 3;
	}

	init(playGround, controlKeys) {
		//Generate DOM to display Score life and level
		this.gameUi.hideContainer();
		this.gameUi.showWrapper();
		this.gameUi.setScore(this.score);
		this.gameUi.setLevel(this.currentLevel);
		this.gameUi.setLife(this.playerLife);

		if (playGround) this.maxLevel = 1;
		this.playGround = playGround || new PlayGround(this.sprites, this.gameUi);
		this.playGround.show();
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
			this.upgradeLevel();
		}

		if (playerStatus.eatenFood.status) {
			this.score += playerStatus.eatenFood.value;
			this.player.gotFood = false;
			this.gameUi.setScore(this.score);
		}

		if (playerStatus.died) {
			cancelAnimationFrame(id);

			if (--this.playerLife < 0) {
				this.gameOver();
				return;
			}

			this.gameUi.setLife(this.playerLife);
			this.player.resetPosition();
			this.player.draw();
			this.player.makeAlive();
			this.start();
		}
	}

	upgradeLevel() {
		if (++this.currentLevel == this.maxLevel) {
			this.gameOver();
			return;
		}
		this.gameUi.setLevel('Upgrading . . . to ' + this.currentLevel);

		this.playGround.upgrade(this.currentLevel, afterUpgrade.bind(this));
	}

	getScore() {
		return this.score;
	}

	gameOver() {
		this.playGround.removeAllObjects();
		this.monster?.die();
		this.afterGameOver();
	}
}
