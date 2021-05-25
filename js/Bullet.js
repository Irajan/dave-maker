class Bullet {
	constructor(owner) {
		this.owner = owner;
		this.x = owner.x;
		this.y = owner.y + GRID_HEIGHT / 2;
		this.dir = owner.leftOrRight || 'left';
		this.width = 10;
		this.height = 5;

		this.enemy = owner.enemy;

		if (this.dir == 'left') {
			this.x -= GRID_WIDTH / 2;
			return;
		}

		if (this.dir == 'right') {
			this.x += GRID_WIDTH / 2;
		}
	}

	update() {
		if (this.dir == 'left') {
			this.x -= 2;
			return;
		}
		if (this.dir == 'right') {
			this.x += 2;
			return;
		}
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.closePath();
		ctx.fill();
	}

	fire(playground) {
		const ctx = playground.ctx;

		const allObjects = [
			...playground.objects[0],
			...playground.objects[1],
			...playground.objects[2],
			...playground.objects[3],
		];

		const objectsCanCollide = allObjects.filter((object) => {
			const isOnTop = this.y - (3 * GRID_HEIGHT) / 2 < object.y;
			const isOnBottom = this.y + GRID_HEIGHT / 2 > object.y;
			const isOnLeft = this.x > object.x;
			const isOnRight = this.x < object.x;

			const isOnFront =
				(isOnRight && this.dir === 'right') ||
				(isOnLeft && this.dir === 'left');

			return isOnTop && isOnBottom && isOnFront;
		});
		let animationId;
		const animate = function () {
			animationId = requestAnimationFrame(animate.bind(this));
			ctx.clearRect(this.x, this.y, this.width, this.height);
			this.update();
			this.draw(ctx);

			objectsCanCollide.push(this.enemy);
			for (let i = 0; i < objectsCanCollide.length; i++) {
				const currentObject = objectsCanCollide[i];

				const tempObject = {
					x: currentObject.x,
					y: currentObject.y,
					width: GRID_WIDTH,
					height: GRID_HEIGHT,
				};

				const tempBullet = {
					x: this.x,
					y: this.y,
					width: this.width,
					height: this.height,
				};

				if (checkCollision(tempBullet, tempObject)) {
					if (currentObject.type == 'obstacle') break;
					cancelAnimationFrame(animationId);
					ctx.clearRect(this.x, this.y, this.width, this.height);
					if (
						currentObject instanceof Player ||
						currentObject instanceof Monster
					) {
						this.enemy.die();
					}
				}
			}
		};
		requestAnimationFrame(animate.bind(this));
	}
}
