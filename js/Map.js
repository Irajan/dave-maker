class Map {
	constructor(elements) {
		this.playerLocation = null;
		this.monsterLocation = null;

		this.staticObjects = new Array();
		this.dynamicObjects = new Array();
		this.index = 0;

		this.map = elements || [
			[
				'RRRRRRRRRRRRRRRRRRR',
				'RP               GR',
				'R  g   g   t   g  R',
				'R  R   R   R   R  R',
				'Rg   g   g   g   gR',
				'RR   R   R   R   RR',
				'Rg     g          R',
				'R   RRRRn  RRRRR  R',
				'R0         R=     R',
				'RRRRRRRRRRRRRRRRRRR',
			],
			[
				'RRRRRRRRRRRRRRRRRRRR',
				'RG     g            ',
				'R              g    ',
				'Rp  p        p      ',
				'R       ppp   R  =   ',
				'R  pp    R   tR  ppp',
				'R        R p  R     ',
				'R   ppp GR    R     ',
				'R0    f  Rg  pR     ',
				'RRRRfffffRffffR     ',
			],
		];
	}

	mapElements(row, col) {
		const indicator = this.map[this.index][row][col];

		switch (indicator) {
			case 'R':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'tile',
				});
				return RED_BRICK;
			case 'B':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'tile',
				});
				return BLUE_BRICK;
			case 'S':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'tile',
				});
				return SAND;
			case 'c':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'tile',
				});
				return SILVER_BAR;
			case 'p':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'tile',
				});
				return PURPLE_BAR;
			case '=':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'door',
				});
				return DOOR;
			case 'G':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'food',
					score: 20,
				});
				return RED_DIAMOND;
			case 'g':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'food',
					score: 10,
				});
				return BLUE_DIAMOND;
			case 'P':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'food',
					score: 50,
				});
				return PURPLE_BALL;
			case 'n':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'food',
					name: GUN,
				});
				return GUN;
			case 't':
				this.dynamicObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'food',
					name: TROPHY,
					score: 200,
				});
				return TROPHY;
			case 'j':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'jetpack',
				});
				return JETPACK;
			case 'f':
				this.dynamicObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'obstacle',
					name: FIRE,
				});
				return FIRE;
			case '0':
				this.staticObjects.push({
					id: this.staticObjects.length + this.dynamicObjects.length,
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
					type: 'tile',
				});

				this.playerLocation = {
					x: (col + 1) * GRID_WIDTH,
					y: row * GRID_HEIGHT,
				};
				return ENTRY_PIPE;
			case 'm':
				this.monsterLocation = {
					x: col * GRID_WIDTH,
					y: row * GRID_HEIGHT,
				};
			default:
				return;
		}
	}

	draw(ctx, sprite) {
		const index = this.index;
		ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
		ctx.beginPath();
		for (let row = 0; row < this.map[index].length; row++) {
			for (let col = 0; col < this.map[index][row].length; col++) {
				const elementsImage = this.mapElements(row, col);

				if (!elementsImage) continue;

				const elements = sprite.sceneElements[elementsImage];
				let sx = elements.location[0].x;
				let sy = elements.location[0].y;
				let sw = elements.width;
				let sh = elements.height;
				let dx = col * GRID_WIDTH;
				let dy = row * GRID_HEIGHT;
				let dw = GRID_WIDTH;
				let dh = GRID_HEIGHT;

				ctx.drawImage(sprite.image, sx, sy, sw, sh, dx, dy, dw, dh);
			}
		}
		ctx.closePath();
	}

	getPlayerPosition() {
		if (!this.playerLocation)
			throw new Error('Cannot trace location of player before drawing map');

		return this.playerLocation;
	}
}
