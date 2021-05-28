class Monster {
	constructor(playground) {
		this.playground = playground;
		this.x = playground.monsterPosition.x;
		this.y = playground.monsterPosition.y;

		this.velX = 1;
		this.velY = 1;

		this.enemy = null;
		this.isFiring = false;

		this.sprite = playground.sprites;
		this.ctx = playground.ctx;
		this.deadOrAlive = 'alive';

		this.draw(this.ctx);
	}

	setEnemy(enemy) {
		this.enemy = enemy;
	}
	init() {
		const minX = this.x;
		const minY = this.y;
		const maxX = this.x + 3 * GRID_WIDTH;
		const maxY = this.y + 2 * GRID_HEIGHT;

		let animationId = requestAnimationFrame(animate.bind(this));
		function animate() {
			this.shoot();
			animationId = requestAnimationFrame(animate.bind(this));
			this.move();
			this.draw(this.ctx);

			const onVerticalBoundary = this.y < minY || this.y + GRID_HEIGHT > maxY;
			const onHorizantalBoundary = this.x < minX || this.x + GRID_WIDTH > maxX;

			if (onVerticalBoundary) {
				this.velY = -this.velY;
			}
			if (onHorizantalBoundary) {
				this.velX = -this.velX;
			}

			if (this.isDead()) {
				cancelAnimationFrame(animationId);
				setTimeout(() => {
					this.ctx.clearRect(this.x, this.y, GRID_WIDTH, GRID_HEIGHT);
				}, SPEED * 100);
			}
		}
	}
	shoot() {
		if (this.isFiring) {
			return;
		}
		this.isFiring = true;
		const bullet = new Bullet(this);
		bullet.fire(this.playground);
		setTimeout(() => {
			this.isFiring = false;
		}, SPEED * 1000);
	}

	die() {
		this.deadOrAlive = 'die';
	}

	move() {
		this.x += this.velX;
		this.y += this.velY;
	}

	isDead() {
		return this.deadOrAlive === 'die';
	}

	draw(ctx, spriteIndex = 0) {
		const deadOrAlive = this.deadOrAlive;
		const image = this.sprite.image;
		const monsterImage = this.sprite.sceneElements[MONSTER];
		const spriteLocation = monsterImage[deadOrAlive];

		ctx.clearRect(this.x - 1, this.y - 1, GRID_WIDTH + 2, GRID_HEIGHT + 2);
		const dx = this.x;
		const dy = this.y;
		const sx = spriteLocation[spriteIndex].x;
		const sy = spriteLocation[spriteIndex].y;
		const sw = monsterImage.width;
		const sh = monsterImage.height;

		ctx.drawImage(image, sx, sy, sw, sh, dx, dy, GRID_WIDTH, GRID_HEIGHT);
	}
}
