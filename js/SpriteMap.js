class SpriteMap {
	constructor(spriteImage) {
		this.image = spriteImage;
		this.sceneElements = {
			[RED_BRICK]: {
				width: 64,
				height: 64,
				location: [{ x: 64, y: 0 }],
			},
			[BLUE_BRICK]: {
				width: 64,
				height: 64,
				location: [{ x: 128, y: 0 }],
			},
			[SAND]: {
				width: 64,
				height: 64,
				location: [{ x: 192, y: 0 }],
			},
			[UP_LEFT_SAND]: {
				width: 62,
				height: 64,
				location: [{ x: 578, y: 0 }],
			},
			[UP_RIGHT_SAND]: {
				width: 62,
				height: 64,
				location: [{ x: 384, y: 0 }],
			},
			[DOWN_LEFT_SAND]: {
				width: 62,
				height: 64,
				location: [{ x: 515, y: 0 }],
			},
			[DOWN_RIGHT_SAND]: {
				width: 62,
				height: 64,
				location: [{ x: 448, y: 0 }],
			},
			[SILVER_BAR]: {
				width: 64,
				height: 64,
				location: [{ x: 640, y: 0 }],
			},
			[PURPLE_BAR]: {
				width: 64,
				height: 64,
				location: [{ x: 256, y: 512 }],
			},
			[DOOR]: {
				width: 58,
				height: 64,
				location: [{ x: 69, y: 512 }],
			},
			[RED_DIAMOND]: {
				width: 64,
				height: 60,
				location: [{ x: 70, y: 65 }],
			},
			[BLUE_DIAMOND]: {
				width: 64,
				height: 60,
				location: [{ x: 4, y: 65 }],
			},
			[PURPLE_BALL]: {
				width: 60,
				height: 60,
				location: [{ x: 130, y: 65 }],
			},
			[GUN]: {
				width: 64,
				height: 60,
				location: [{ x: 192, y: 65 }],
			},
			[TROPHY]: {
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
			[JETPACK]: {
				width: 60,
				height: 64,
				location: [{ x: 515, y: 64 }],
			},
			[ENTRY_PIPE]: {
				width: 64,
				height: 64,
				location: [{ x: 128, y: 512 }],
			},
			[FIRE]: {
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
		};
	}
}
