class Player {
	constructor(playground) {
		this.playground = playground;
		this.x = playground.playerPosition.x;
		this.y = playground.playerPosition.y;
		this.targetX;
		this.targetY;
		this.enemy = null;

		this.sprite = playground.sprites;
		this.ctx = playground.ctx;
		this.spriteIndex = 1;
		this.leftOrRight = 'right';

		this.onAir = false;
		this.isMoving = false;
		this.isJumping = false;
		this.isFiring = false;
		this.isDying = false;

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
	}

	jump() {
		if (this.onAir || this.isJumping || this.isDying) return;

		this.onAir = true;
		this.isJumping = true;

		this.targetY = this.y - 2 * GRID_HEIGHT - 10;

		const interval = setInterval(() => {
			this.update();

			if (this.targetY >= this.y) {
				clearInterval(interval);
				this.isJumping = false;
				this.fallDown();
			} else {
				this.y -= STEP_PER_FRAME;
				this.quardantIndex = getQuardant(
					this.x,
					this.y,
					SCREEN_WIDTH,
					SCREEN_HEIGHT
				);
			}
			if (!this.reachedDoor) this.draw(this.ctx, 3);
		}, SPEED);
	}

	moveLeft() {
		if (this.isMoving || this.isDying) {
			return;
		}
		this.leftOrRight = 'left';

		this.isMoving = true;
		this.spriteIndex = (this.spriteIndex + 1) % 3;

		this.targetX = this.x - GRID_WIDTH / 2;

		if (this.onAir) this.targetX -= GRID_WIDTH;

		const interval = setInterval(() => {
			const possibleCollideObjects = this.getPossibleCollideObjects();
			for (let i = 0; i < possibleCollideObjects.length; i++) {
				const currentObject = possibleCollideObjects[i];
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
				if (checkCollision(tempPlayer, tempObject).status) {
					const isFood = currentObject.type === 'food';
					const isObstacle = currentObject.type === 'ObstaisObstacle';
					const isDoor = currentObject.type === 'door';
					if (isDoor && this.hasKey) {
						this.reachedDoor = true;
						this.enemy?.die();
						break;
					}
					if (isFood) {
						this.eat(currentObject);
						continue;
					}
					if (isObstacle) {
						this.die();
					}
					this.targetX = this.x;
				}
			}
			if (this.targetX >= this.x) {
				clearInterval(interval);
				this.isMoving = false;
				if (!this.isJumping) this.fallDown();
			} else {
				this.x -= STEP_PER_FRAME;
			}
			if (!this.reachedDoor)
				this.draw(this.ctx, this.isJumping ? 3 : this.spriteIndex);
		}, SPEED);
	}

	moveRight() {
		if (this.isMoving || this.isDying) {
			return;
		}
		this.isMoving = true;
		this.leftOrRight = 'right';

		let targetX = this.x + GRID_WIDTH / 2;

		if (this.onAir) targetX += GRID_WIDTH;

		this.spriteIndex = (this.spriteIndex + 1) % 3;

		const interval = setInterval(() => {
			const possibleCollideObjects = this.getPossibleCollideObjects();

			for (let i = 0; i < possibleCollideObjects.length; i++) {
				const currentObject = possibleCollideObjects[i];

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

				if (checkCollision(tempPlayer, tempObject).status) {
					const isFood = currentObject.type === 'food';
					const isObstacle = currentObject.type === 'obstacle';

					const isDoor = currentObject.type === 'door';
					if (isDoor && this.hasKey) {
						this.reachedDoor = true;
						this.enemy?.die();
						break;
					}

					if (isFood) {
						this.eat(currentObject);
						continue;
					}
					if (isObstacle) {
						this.die();
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
				if (this.x % SCREEN_WIDTH == 0) {
					this.playground.reachedCheckpoint(this.x, this.y);
				}
			}
			if (!this.reachedDoor)
				this.draw(this.ctx, this.isJumping ? 3 : this.spriteIndex);
		}, SPEED);
	}

	fallDown() {
		clearInterval(this.fallingId);

		if (this.isDying) return;

		let targetY = SCREEN_HEIGHT;
		this.onAir = true;

		this.fallingId = setInterval(() => {
			const possibleCollideObjects = this.getPossibleCollideObjects();

			for (let i = 0; i < possibleCollideObjects.length; i++) {
				const currentObject = possibleCollideObjects[i];
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

				if (checkCollision(tempPlayer, tempObject).status) {
					const isFood = currentObject.type === 'food';
					const isDoor = currentObject.type === 'door';
					const isObstacle = currentObject.type === 'obstacle';

					if (isDoor && this.hasKey) {
						this.reachedDoor = true;
						this.enemy?.die();
						break;
					}

					if (isFood) {
						this.eat(currentObject);
						continue;
					}

					if (isObstacle) {
						this.die();
					}
					targetY = this.y;
				}
			}

			if (targetY <= this.y) {
				this.onAir = false;
				clearInterval(this.fallingId);
			} else {
				this.y += STEP_PER_FRAME;
			}

			if (!this.reachedDoor) this.draw(this.ctx, 0);
		}, SPEED);
	}

	update() {
		const possibleCollideObjects = this.getPossibleCollideObjects();

		for (let i = 0; i < possibleCollideObjects.length; i++) {
			const currentObject = possibleCollideObjects[i];

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

			const { status, direction } = checkCollision(tempObject, tempPlayer);

			if (status) {
				const isFood = currentObject.type === 'food';
				const isObstacle = currentObject.type === 'obstacle';
				const isDoor = currentObject.type === 'door';

				if (isDoor && this.hasKey) {
					this.reachedDoor = true;
					this.enemy?.die();
					break;
				}
				if (isFood) {
					this.eat(currentObject);
					continue;
				}

				if (isObstacle) {
					this.die();
				}

				if (direction === 't' || direction === 'b') {
					this.targetY = this.y;
				}
				if (direction === 'l' || direction === 'r') {
					this.targetX = this.x;
				}
			}
		}
	}

	eat(food) {
		this.gotFood = { status: true, value: food.score };
		this.playground.remove(food);
		if (food.name === TROPHY) {
			this.hasKey = true;
			return;
		}
		if (food.name === GUN) {
			this.hasGun = true;
		}
	}

	shoot() {
		if (!this.hasGun || this.isFiring) {
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
		this.leftOrRight = 'die';
		this.isDying = true;
		let spriteIndex = 1;
		const interval = setInterval(() => {
			this.draw(this.ctx, 1);
			spriteIndex--;

			if (spriteIndex < 0) {
				clearInterval(interval);
				this.isDead = true;
				this.ctx.clearRect(this.x, this.y - 1, GRID_WIDTH, GRID_HEIGHT + 2);
			}
		}, SPEED * 100);
	}

	makeAlive() {
		this.isDead = false;
		this.isDying = false;
	}

	draw(ctx = this.ctx, spriteIndex = 0) {
		const leftOrRight = this.leftOrRight;

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

	getPossibleCollideObjects() {
		const topLeft = {
			x: this.x - GRID_WIDTH / 2,
			y: this.y - GRID_HEIGHT / 2,
		};
		const topRight = {
			x: this.x + GRID_WIDTH / 2,
			y: this.y - GRID_HEIGHT / 2,
		};
		const bottomLeft = {
			x: this.x - GRID_WIDTH / 2,
			y: this.y + GRID_HEIGHT / 2,
		};
		const bottomRight = {
			x: this.x + GRID_WIDTH / 2,
			y: this.y + GRID_HEIGHT / 2,
		};

		const sw = SCREEN_WIDTH;
		const sh = SCREEN_HEIGHT;

		const quardantIndexis = new Array();
		quardantIndexis[0] = getQuardant(topLeft.x, topLeft.y, sw, sh);
		quardantIndexis[1] = getQuardant(topRight.x, topRight.y, sw, sh);
		quardantIndexis[2] = getQuardant(bottomLeft.x, bottomLeft.y, sw, sh);
		quardantIndexis[3] = getQuardant(bottomRight.x, bottomRight.y, sw, sh);

		const differentQuardants = getUnique(quardantIndexis);
		const objectsCanCollode = new Array();

		differentQuardants.forEach((quardantIndex) => {
			const objectsInQuardant = this.playground.objects[quardantIndex];
			objectsInQuardant.forEach((object) => {
				objectsCanCollode.push(object);
			});
		});

		const objectsInsideBoundary = objectsCanCollode.filter((object) => {
			const boundary = {
				...topLeft,
				width: GRID_WIDTH * 2,
				height: GRID_HEIGHT * 2,
			};
			const tempObj = {
				x: object.x,
				y: object.y,
				width: GRID_WIDTH,
				height: GRID_HEIGHT,
			};

			return checkCollision(boundary, tempObj).status;
		});

		return objectsInsideBoundary;
	}
}
