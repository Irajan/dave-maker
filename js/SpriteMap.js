class SpriteMap {
	constructor(spriteImage) {
		this.image = spriteImage;
		this.sceneElements = {
			[RED_BRICK]: {
				code: 'R',
				width: 64,
				height: 64,
				location: [{ x: 64, y: 0 }],
			},
			[BLUE_BRICK]: {
				code: 'B',
				width: 64,
				height: 64,
				location: [{ x: 128, y: 0 }],
			},
			[SAND]: {
				code: 'S',
				width: 64,
				height: 64,
				location: [{ x: 192, y: 0 }],
			},

			[SILVER_BAR]: {
				code: 'c',
				width: 64,
				height: 64,
				location: [{ x: 640, y: 0 }],
			},
			[PURPLE_BAR]: {
				code: 'p',
				width: 64,
				height: 64,
				location: [{ x: 256, y: 512 }],
			},
			[DOOR]: {
				code: '=',
				width: 58,
				height: 64,
				location: [{ x: 69, y: 512 }],
			},
			[RED_DIAMOND]: {
				code: 'G',
				width: 64,
				height: 60,
				location: [{ x: 70, y: 65 }],
			},
			[BLUE_DIAMOND]: {
				code: 'g',
				width: 64,
				height: 60,
				location: [{ x: 4, y: 65 }],
			},
			[PURPLE_BALL]: {
				code: 'P',
				width: 60,
				height: 60,
				location: [{ x: 130, y: 65 }],
			},
			[GUN]: {
				code: 'n',
				width: 64,
				height: 60,
				location: [{ x: 192, y: 65 }],
			},
			[TROPHY]: {
				code: 't',
				width: 64,
				height: 64,
				location: [
					{ x: 0, y: 256 },
					{ x: 64, y: 256 },
					{ x: 128, y: 256 },
					{ x: 192, y: 256 },
					{ x: 256, y: 256 },
				],
			},
			[ENTRY_PIPE]: {
				code: '0',
				width: 64,
				height: 64,
				location: [{ x: 128, y: 512 }],
			},
			[FIRE]: {
				code: 'f',
				width: 60,
				height: 60,
				location: [
					{ x: 0, y: 322 },
					{ x: 64, y: 322 },
					{ x: 128, y: 322 },
					{ x: 192, y: 322 },
				],
			},
			[PLAYER]: {
				width: 64,
				height: 64,
				right: [
					{ x: 64, y: 128 },
					{ x: 128, y: 128 },
					{ x: 192, y: 128 },
					{ x: 256, y: 128 },
				],
				left: [
					{ x: 320, y: 128 },
					{ x: 384, y: 128 },
					{ x: 448, y: 128 },
					{ x: 512, y: 128 },
				],
				die: [
					{ x: 0, y: 640 },
					{ x: 64, y: 640 },
				],
			},
			[MONSTER]: {
				code: 'm',
				width: 70,
				height: 64,
				alive: [{ x: 142, y: 640 }],
				die: [
					{ x: -1, y: 640 },
					{ x: 64, y: 640 },
				],
				location: [{ x: 142, y: 640 }],
			},
		};
	}
}
