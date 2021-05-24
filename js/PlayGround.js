class PlayGround {
	constructor(sprites, map) {
		this.map = map || new Map();
		this.map.index = 1;
		this.sprites = sprites;
		this.playerPosition = null;
		this.ctx = null;

		this.objects = [[], [], [], []];
		this.intervals = new Array();
	}

	show(ctx) {
		this.ctx = ctx;
		this.map.draw(ctx, this.sprites);
		this.playerPosition = this.map.playerLocation;

		const staticObjects = this.map.staticObjects;
		const dynamicObjects = this.map.dynamicObjects;

		for (let i = 0; i < dynamicObjects.length; i++) {
			drawOnInterval.call(this, dynamicObjects[i]);
			const quardantIndex = getQuardant(
				dynamicObjects[i].x,
				dynamicObjects[i].y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			this.objects[quardantIndex].push(dynamicObjects[i]);
		}

		for (let i = 0; i < staticObjects.length; i++) {
			const quardantIndex = getQuardant(
				staticObjects[i].x,
				staticObjects[i].y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			this.objects[quardantIndex].push(staticObjects[i]);
		}

		function drawOnInterval(obj) {
			const sprite = this.sprites;
			const image = sprite.image;

			const objectType = obj.name;
			const spriteElement = sprite.sceneElements[objectType];
			const id = obj.id;
			const sw = spriteElement.width;
			const sh = spriteElement.height;

			const dx = obj.x;
			const dy = obj.y;
			const dw = GRID_WIDTH;
			const dh = GRID_HEIGHT;

			const spriteLocation = spriteElement.location;
			let i = 0;
			const interval = setInterval(() => {
				const sx = spriteLocation[i].x;
				const sy = spriteLocation[i].y;

				this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
				i = (i + 1) % spriteLocation.length;
			}, 100);
			this.intervals.push({ id, interval });
		}
	}

	upgrade(level, afterUpgrade) {
		const upgraeScreenElements = [
			[
				'                   ',
				'                   ',
				'                   ',
				'BBBBBBBBBBBBBBBBBBB',
				'0                  ',
				'BBBBBBBBBBBBBBBBBBB',
				'                   ',
				'                   ',
				'                   ',
				'                   ',
			],
		];
		this.map = new Map(upgraeScreenElements);
		this.removeAllObjects();
		this.show(this.ctx);
		const tempPlayer = new Player(this);

		console.log(this);

		const interval = setInterval(() => {
			tempPlayer.moveRight();

			if (tempPlayer.x > SCREEN_WIDTH) {
				clearInterval(interval);
				this.map = new Map();
				this.map.index = level;
				this.removeAllObjects();
				this.show(this.ctx);
				afterUpgrade();
			}
		}, SPEED / 2);
	}

	remove(object) {
		const quardantIndex = getQuardant(
			object.x,
			object.y,
			SCREEN_WIDTH,
			SCREEN_HEIGHT
		);
		const oldElements = this.objects[quardantIndex];
		this.objects[quardantIndex] = oldElements.filter(({ id }) => {
			if (id === object.id) {
				this.ctx.clearRect(object.x, object.y, GRID_WIDTH, GRID_HEIGHT);
				return false;
			}
			return true;
		});
		this.intervals.forEach(function (interval) {
			if (object.id === interval.id) clearInterval(interval.interval);
		});
	}

	removeAllObjects() {
		this.objects = [[], [], [], []];
		this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		this.intervals.forEach(function (interval) {
			clearInterval(interval.interval);
		});
	}
}
