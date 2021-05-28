class PlayGround {
	constructor(sprites, gameUi, mapElements) {
		this.map = new Map(mapElements);
		this.map.index = 0;
		this.sprites = sprites;
		this.playerPosition = null;
		this.monsterPosition = null;

		gameUi.showGameScreen();
		this.gameScreen = gameUi.getGameScreen();

		this.ctx = this.gameScreen.getContext('2d');
		this.objects = [[], [], [], []];
		this.intervals = new Array(); //Array to store intervals of each items anamiting
	}

	show() {
		const ctx = this.ctx;
		this.gameScreen.style.transform = 'translateX(0px)';

		this.gameScreen.width = GRID_WIDTH * this.map.map[this.map.index][0].length;
		this.gameScreen.height = GRID_HEIGHT * this.map.map[this.map.index].length;

		this.map.draw(ctx, this.sprites);
		this.playerPosition = this.map.playerLocation;

		if (this.map.monsterLocation != null) {
			this.monsterPosition = this.map.monsterLocation;
		}

		const staticObjects = this.map.staticObjects; //Objects without animation
		const dynamicObjects = this.map.dynamicObjects; //Objects with animation

		//Push all the objects in playground into respective quardants
		for (let i = 0; i < dynamicObjects.length; i++) {
			drawOnInterval.call(this, dynamicObjects[i]);

			const currentObject = dynamicObjects[i];

			const topLeftQuardant = getQuardant(
				currentObject.x,
				currentObject.y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);
			const topRightQuardant = getQuardant(
				currentObject.x + GRID_WIDTH,
				currentObject.y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			const bottomLeftQuardant = getQuardant(
				currentObject.x,
				currentObject.y + GRID_HEIGHT,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			const bottomRightQuardant = getQuardant(
				currentObject.x + GRID_WIDTH,
				currentObject.y + GRID_HEIGHT,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			this.objects[topLeftQuardant].push(currentObject);
			this.objects[topRightQuardant].push(currentObject);
			this.objects[bottomLeftQuardant].push(currentObject);
			this.objects[bottomRightQuardant].push(currentObject);
		}

		for (let i = 0; i < staticObjects.length; i++) {
			const currentObject = staticObjects[i];

			const topLeftQuardant = getQuardant(
				currentObject.x,
				currentObject.y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);
			const topRightQuardant = getQuardant(
				currentObject.x + GRID_WIDTH,
				currentObject.y,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			const bottomLeftQuardant = getQuardant(
				currentObject.x,
				currentObject.y + GRID_HEIGHT,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			const bottomRightQuardant = getQuardant(
				currentObject.x + GRID_WIDTH,
				currentObject.y + GRID_HEIGHT,
				SCREEN_WIDTH,
				SCREEN_HEIGHT
			);

			this.objects[topLeftQuardant].push(currentObject);
			this.objects[topRightQuardant].push(currentObject);
			this.objects[bottomLeftQuardant].push(currentObject);
			this.objects[bottomRightQuardant].push(currentObject);
		}

		this.objects[0] = getUniqueObjects(this.objects[0]);
		this.objects[1] = getUniqueObjects(this.objects[1]);
		this.objects[2] = getUniqueObjects(this.objects[2]);
		this.objects[3] = getUniqueObjects(this.objects[3]);

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
		this.gameScreen.style.transform = 'translateX(0px)';
		this.gameScreen.style.transition = '0s';
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
		this.show();
		const tempPlayer = new Player(this);

		let animationId = requestAnimationFrame(animate.bind(this));

		function animate() {
			animationId = requestAnimationFrame(animate.bind(this));
			tempPlayer.moveRight();

			if (tempPlayer.x > SCREEN_WIDTH - 1) {
				this.gameScreen.style.transition = '2s';
				cancelAnimationFrame(animationId);
				this.map = new Map();
				this.map.index = level;
				tempPlayer.die();
				this.removeAllObjects();
				this.show(this.ctx);
				afterUpgrade();
			}
		}
	}

	reachedCheckpoint(x, y) {
		this.gameScreen.style.transform = 'translateX(-' + x + 'px)';
		this.playerPosition.x = x;
		this.playerPosition.y = y;
	}

	remove(object) {
		for (let i = 0; i < this.objects.length; i++) {
			const oldElements = this.objects[i];
			this.objects[i] = oldElements.filter(({ id }) => {
				if (id === object.id) {
					this.ctx.clearRect(object.x, object.y, GRID_WIDTH, GRID_HEIGHT);
					return false;
				}
				return true;
			});
		}

		//Clear Interval of object if it is animating;
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
