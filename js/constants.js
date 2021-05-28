const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;

const COLS_PER_FRAME = 19;
const ROWS_PER_FRAME = 10;

const SCREEN_WIDTH = COLS_PER_FRAME * GRID_WIDTH;
const SCREEN_HEIGHT = ROWS_PER_FRAME * GRID_HEIGHT;

const STEP_PER_FRAME = 1;
const SPEED = 7;

const CONTROLLER_KEYS = [
	{
		up: 'ArrowUp',
		left: 'ArrowLeft',
		right: 'ArrowRight',
		shoot: 'Space',
		img: {
			up: './assets/images/keyboard_key_up.png',
			left: './assets/images/keyboard_key_left.png',
			right: './assets/images/keyboard_key_right.png',
			shoot: './assets/images/keyboard_key_space.png',
		},
	},
	{
		up: 'KeyW',
		left: 'KeyA',
		right: 'KeyD',
		shoot: 'KeyX',
		img: {
			up: './assets/images',
			left: './assets/images',
			right: './assets/images/',
			shoot: './assets/images/',
		},
	},
];

const RED_BRICK = 'redBrick';
const BLUE_BRICK = 'blueBrick';
const SAND = 'sand';
const UP_LEFT_SAND = 'upLeftSand';
const UP_RIGHT_SAND = 'upRightSand';
const DOWN_LEFT_SAND = 'downLeftSand';
const DOWN_RIGHT_SAND = 'downRightSand';
const SILVER_BAR = 'silverBar';
const PURPLE_BAR = 'purpleBar';
const DOOR = 'door';
const RED_DIAMOND = 'redDiamond';
const BLUE_DIAMOND = 'blueDiamond';
const PURPLE_BALL = 'purpleBall';
const GUN = 'gun';
const TROPHY = 'trophy';
const JETPACK = 'jetpack';
const ENTRY_PIPE = 'pipe';
const PLAYER = 'player';
const FIRE = 'fire';
const MONSTER = 'monster';
