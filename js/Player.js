class Player {
	constructor(playground) {
		this.playground = playground;
		this.x = playground.playerPosition.x;
		this.y = playground.playerPosition.y;
		this.enemy = null;

		this.sprite = playground.sprites;
		this.ctx = playground.ctx;
		this.spriteIndex = 1;
		this.leftOrRight = 'right';

		this.onAir = false;
		this.isMoving = false;
		this.isJumping = false;
		this.isFiring = false;

		this.fallingId = null;

		this.reachedDoor = false;
		this.gotFood = { status: false, value: 0 };
		this.isDead = false;

		this.hasKey = false;
		this.hasGun = false;

		this.quardantIndex = getQuardant(
			this.x,
			this.y,
			SCREEN_WIDTH,
			SCREEN_HEIGHT
		);
		this.draw(this.ctx);
	}

	setEnemy(enemy) {
		this.enemy = enemy;

		console.log(enemy, 'is my enemy');
	}

	jump() {
		if (this.onAir || this.isJumping) return;

		this.onAir = true;
		this.isJumping = true;

		let targetY = this.y - 2 * GRID_HEIGHT - 10;

		const interval = setInterval(() => {
			const quardantIndex = getQuardant(
				this.x,
				this.y - GRID_HEIGHT,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			let objectsInQuardant = this.playground.objects[quardantIndex];

			//	if (quardantIndex != this.quardantIndex) {
			objectsInQuardant = [
				...this.playground.objects[0],
				...this.playground.objects[1],
				...this.playground.objects[2],
				...this.playground.objects[3],
			];
			//	}

			for (let i = 0; i < objectsInQuardant.length; i++) {
				const currentObject = objectsInQuardant[i];

				if (currentObject.y + GRID_HEIGHT > this.y) {
					continue;
				}

				const tempObject = {
					x: currentObject.x,
					y: currentObject.y,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				const tempPlayer = {
					x: this.x,
					y: this.y - STEP_PER_FRAME,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				if (checkCollision(tempPlayer, tempObject)) {
					const isFood = currentObject.type === 'food';
					const isObstacle = currentObject.type === 'obstacle';
					const isDoor = currentObject.type === 'door';

					if (isDoor && this.hasKey) {
						this.reachedDoor = true;
						break;
					}
					if (isFood) {
						this.eat(currentObject);
						continue;
					}

					if (isObstacle) {
						this.isDead = true;
						this.leftOrRight = 'die';
					}
					targetY = this.y;
				}
			}

			if (targetY >= this.y) {
				clearInterval(interval);
				this.isJumping = false;
				this.fallDown();
			} else {
				this.y -= STEP_PER_FRAME;
				this.quardantIndex = quardantIndex;
			}
			if (!this.reachedDoor) this.draw(this.ctx, 3);
		}, SPEED);
	}

	moveLeft() {
		if (this.isMoving) return;
		this.leftOrRight = 'left';

		this.isMoving = true;
		this.spriteIndex = (this.spriteIndex + 1) % 3;

		let targetX = this.x - GRID_WIDTH / 2;

		if (this.onAir) targetX -= GRID_WIDTH;

		const interval = setInterval(() => {
			const quardantIndex = getQuardant(
				this.x - GRID_WIDTH,
				this.y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			let objectsInQuardant = this.playground.objects[quardantIndex];

			//	if (quardantIndex != this.quardantIndex) {
			//		console.log('Quardant Changed');
			objectsInQuardant = [
				...this.playground.objects[0],
				...this.playground.objects[1],
				...this.playground.objects[2],
				...this.playground.objects[3],
			];
			//	}
			for (let i = 0; i < objectsInQuardant.length; i++) {
				const currentObject = objectsInQuardant[i];

				if (currentObject.x + GRID_WIDTH > this.x) {
					continue;
				}

				const tempObject = {
					x: currentObject.x,
					y: currentObject.y,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				const tempPlayer = {
					x: this.x - STEP_PER_FRAME,
					y: this.y,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				if (checkCollision(tempPlayer, tempObject)) {
					const isFood = currentObject.type === 'food';
					const isObstacle = currentObject.type === 'ObstaisObstacle';

					const isDoor = currentObject.type === 'door';
					if (isDoor && this.hasKey) {
						this.reachedDoor = true;
						break;
					}

					if (isFood) {
						this.eat(currentObject);
						continue;
					}

					if (isObstacle) {
						this.isDead = true;
						this.leftOrRight = 'die';
					}

					targetX = this.x;
				}
			}

			if (targetX >= this.x) {
				clearInterval(interval);
				this.isMoving = false;

				if (!this.isJumping) this.fallDown();
			} else {
				this.x -= STEP_PER_FRAME;
				this.quardantIndex = quardantIndex;
			}
			if (!this.reachedDoor)
				this.draw(this.ctx, this.isJumping ? 3 : this.spriteIndex);
		}, SPEED);
	}

	moveRight() {
		if (this.isMoving) return;
		this.isMoving = true;
		this.leftOrRight = 'right';

		let targetX = this.x + GRID_WIDTH / 2;

		if (this.onAir) targetX += GRID_WIDTH;

		this.spriteIndex = (this.spriteIndex + 1) % 3;

		const interval = setInterval(() => {
			const quardantIndex = getQuardant(
				this.x + GRID_WIDTH,
				this.y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);
			let objectsInQuardant = this.playground.objects[quardantIndex];

			//		if (quardantIndex != this.quardantIndex) {
			objectsInQuardant = [
				...this.playground.objects[0],
				...this.playground.objects[1],
				...this.playground.objects[2],
				...this.playground.objects[3],
			];
			//		}

			for (let i = 0; i < objectsInQuardant.length; i++) {
				const currentObject = objectsInQuardant[i];

				if (currentObject.x + GRID_WIDTH < this.x + GRID_WIDTH) {
					continue;
				}

				const tempObject = {
					x: currentObject.x,
					y: currentObject.y,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				const tempPlayer = {
					x: this.x + STEP_PER_FRAME,
					y: this.y,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				if (checkCollision(tempPlayer, tempObject)) {
					const isFood = currentObject.type === 'food';
					const isObstacle = currentObject.type === 'obstacle';

					const isDoor = currentObject.type === 'door';
					if (isDoor && this.hasKey) {
						this.reachedDoor = true;
						break;
					}

					if (isFood) {
						this.eat(currentObject);
						continue;
					}
					if (isObstacle) {
						this.isDead = true;
						this.leftOrRight = 'die';
					}

					targetX = this.x;
				}
			}

			if (targetX <= this.x) {
				this.isMoving = false;
				clearInterval(interval);

				if (!this.isJumping) this.fallDown();
			} else {
				this.x += STEP_PER_FRAME;
				this.quardantIndex = quardantIndex;
			}
			if (!this.reachedDoor)
				this.draw(this.ctx, this.isJumping ? 3 : this.spriteIndex);
		}, SPEED);
	}

	fallDown() {
		clearInterval(this.fallingId);

		let targetY = SCREEN_HEIGHT;
		this.onAir = true;

		this.fallingId = setInterval(() => {
			const quardantIndex = getQuardant(
				this.x,
				this.y + GRID_HEIGHT,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			let objectsInQuardant = this.playground.objects[quardantIndex];

			//	if (quardantIndex != this.quardantIndex) {
			objectsInQuardant = [
				...this.playground.objects[0],
				...this.playground.objects[1],
				...this.playground.objects[2],
				...this.playground.objects[3],
			];
			//	}

			for (let i = 0; i < objectsInQuardant.length; i++) {
				const currentObject = objectsInQuardant[i];
				if (currentObject.y < this.y + GRID_HEIGHT) {
					continue;
				}

				const tempObject = {
					x: currentObject.x,
					y: currentObject.y,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				const tempPlayer = {
					x: this.x,
					y: this.y + STEP_PER_FRAME,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				if (checkCollision(tempPlayer, tempObject)) {
					const isFood = currentObject.type === 'food';
					const isDoor = currentObject.type === 'door';
					const isObstacle = currentObject.type === 'obstacle';

					if (isDoor && this.hasKey) {
						this.reachedDoor = true;
						break;
					}

					if (isFood) {
						this.eat(currentObject);
						continue;
					}

					if (isObstacle) {
						this.isDead = true;
						this.leftOrRight = 'die';
					}
					targetY = this.y;
				}
			}

			if (targetY <= this.y) {
				this.onAir = false;
				clearInterval(this.fallingId);
			} else {
				this.y += STEP_PER_FRAME;
				this.quardantIndex = quardantIndex;
			}

			if (!this.reachedDoor) this.draw(this.ctx, 0);
		}, SPEED);
	}
	eat(food) {
		this.gotFood = { status: true, value: food.score };
		this.playground.remove(food);
		if (food.name === 'trophy') {
			this.hasKey = true;
		}
	}

	shoot() {
		if (!this.hasGun && this.isFiring) {
			return;
		}
		this.isFiring = true;

		const bullet = new Bullet(this);
		bullet.fire(this.playground);
		setTimeout(() => {
			this.isFiring = false;
		}, SPEED * 100);
	}

	die() {
		this.isDead = true;
		this.leftOrRight = 'die';
	}

	draw(ctx, spriteIndex = 0) {
		const leftOrRight = this.leftOrRight;
		const quardants = this.playground.objects[this.quardantIndex];

		quardants.forEach((el) => {
			ctx.fillStyle = getRandomColor();
			ctx.fillText('' + el.id, el.x + 25, el.y + 25);
		});

		const image = this.sprite.image;
		const spriteLocation = this.sprite.sceneElements[PLAYER][leftOrRight];

		ctx.clearRect(this.x, this.y - 1, GRID_WIDTH, GRID_HEIGHT + 2);
		const dx = this.x;
		const dy = this.y;
		const sx = spriteLocation[spriteIndex].x;
		const sy = spriteLocation[spriteIndex].y;
		ctx.drawImage(image, sx, sy, 64, 64, dx, dy, GRID_WIDTH, GRID_HEIGHT);
	}

	resetPosition() {
		this.x = this.playground.playerPosition.x;
		this.y = this.playground.playerPosition.y;
		this.leftOrRight = 'right';
	}

	getStatus() {
		return {
			reachedDoor: this.reachedDoor,
			eatenFood: this.gotFood,
			hasKey: this.hasKey,
			died: this.isDead,
		};
	}
}
