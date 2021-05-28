class GroundGenerator {
	constructor(sprite, gameUi) {
		this.sprite = sprite;
		this.gameUi = gameUi;

		//Create Buttons for navigation
		const buttonHolder = document.createElement('div');

		this.buttonHolder = buttonHolder;
		this.itemCanvas = gameUi.itemCanvas;
		this.itemCanvas.width = GRID_WIDTH * 19;
		this.gameUi.addElement(this.itemCanvas);

		const createBtn = (this.createBtn = this.gameUi.createButton('Create'));
		const playBtn = (this.playBtn = this.gameUi.createButton('Play'));
		const backBtn = (this.backBtn = this.gameUi.createBackToMenu());
		const clearBtn = (this.clearBtn = this.gameUi.createButton('Clear'));

		this.gameUi.addClass(buttonHolder, 'wrapper');
		this.gameUi.addClass(createBtn, 'btn');
		this.gameUi.addClass(backBtn, 'btn');
		this.gameUi.addClass(playBtn, 'btn');
		this.gameUi.addClass(clearBtn, 'btn');

		this.gameUi.addElement(playBtn, buttonHolder);
		this.gameUi.addElement(createBtn, buttonHolder);
		this.gameUi.addElement(backBtn, buttonHolder);
		this.gameUi.addElement(clearBtn, buttonHolder);
		this.gameUi.addElement(buttonHolder);

		this.createdGround = null;

		this.itemCanvas.height = GRID_HEIGHT;

		this.mainCanvas = gameUi.gameScreen;
		this.mainCtx = this.mainCanvas.getContext('2d');
		this.itemCtx = this.itemCanvas.getContext('2d');

		this.images = new Array();
		this.mapElementArray;

		this.selectedItemIndex = 0;

		this.rows = 10;
		this.cols = 19;

		this.mainCanvas.width = GRID_WIDTH * this.cols;
		this.mainCanvas.height = GRID_HEIGHT * this.rows;

		window.addEventListener('mousedown', () => {
			this.isDrawing = true;
		});

		window.addEventListener('mouseup', () => {
			this.isDrawing = false;
		});

		this.createBtn.addEventListener('click', this.create.bind(this));
		this.clearBtn.addEventListener('click', this.clear.bind(this));
		this.itemCanvas.addEventListener('click', (e) => {
			const ctx = this.itemCtx;
			const boundRect = e.target.getBoundingClientRect();
			const x = e.clientX - boundRect.left;
			const y = e.clientY - boundRect.top;
			ctx.strokeStyle = '#000';
			ctx.stroke();

			this.selectedItemIndex = Math.floor(x / GRID_WIDTH);

			if (this.selectedItemIndex >= this.images.length) {
				return;
			}

			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.strokeStyle = 'red';
			ctx.rect(GRID_WIDTH * this.selectedItemIndex, 0, GRID_WIDTH, GRID_HEIGHT);
			ctx.closePath();
			ctx.stroke();
		});

		const sceneElements = this.sprite.sceneElements;
		let drawIndex = 0;
		for (let currentKey in sceneElements) {
			const imageClip = sceneElements[currentKey];

			if (!imageClip.location) continue;

			const sx = imageClip?.location[0].x;
			const sy = imageClip?.location[0].y;
			const sw = imageClip?.width;
			const sh = imageClip?.height;
			const dx = drawIndex * GRID_WIDTH + 2;
			const dy = 0;
			const dw = GRID_WIDTH - 2;
			const dh = GRID_HEIGHT - 2;

			this.itemCtx.drawImage(this.sprite.image, sx, sy, sw, sh, dx, dy, dw, dh);
			this.images[drawIndex++] = imageClip;
		}
	}

	clear() {
		for (let i = 0; i < this.cols * GRID_WIDTH; i += GRID_WIDTH) {
			for (let j = 0; j < this.rows * GRID_HEIGHT; j += GRID_HEIGHT) {
				this.mainCtx.fillStyle = '#891';
				this.mainCtx.fillRect(i, j, GRID_WIDTH - 1, GRID_HEIGHT - 1);
				this.mainCtx.closePath();
				this.mainCtx.fill();
			}
		}
		this.mapElementArray = new Array(this.rows);

		for (let i = 0; i < this.rows; i++) {
			this.mapElementArray[i] = new Array(this.cols);
		}

		if (this.createdGround !== null) {
			this.createdGround.removeAllObjects();
		}
	}

	init() {
		this.clear();
		this.mainCanvas.addEventListener('mousemove', this.drawOnCanvas);
		this.buttonHolder.style.display = 'block';
		this.gameUi.showItemCanvas();
		this.gameUi.hideMenu();
		this.gameUi.showGameScreen();

		this.createBtn.disabled = true;
		this.playBtn.disabled = true;
	}

	drawOnCanvas = (e) => {
		if (!this.isDrawing) return;
		this.createBtn.disabled = false;
		const boundRect = e.target.getBoundingClientRect();
		const x = e.clientX - boundRect.left;
		const y = e.clientY - boundRect.top;

		createBtn.disabled = false;

		const imageItem = this.images[this.selectedItemIndex];
		const gridX = Math.floor(x / GRID_WIDTH);
		const gridY = Math.floor(y / GRID_HEIGHT);

		const sx = imageItem?.location[0].x;
		const sy = imageItem?.location[0].y;
		const sw = imageItem?.width;
		const sh = imageItem?.height;
		const dx = gridX * GRID_WIDTH;
		const dy = gridY * GRID_HEIGHT;
		const dw = GRID_WIDTH;
		const dh = GRID_HEIGHT;

		this.mainCtx.drawImage(this.sprite.image, sx, sy, sw, sh, dx, dy, dw, dh);
		this.mapElementArray[gridY][gridX] = imageItem?.code;
	};

	create() {
		if (!this.performValidation()) return;

		this.playBtn.disabled = false;
		const mapElements = [];
		mapElements.push(this.mapElementArray);

		//If ground was initially created remove the objects contained
		if (this.createdGround !== null) {
			this.createdGround.removeAllObjects();
		}

		this.createdGround = new PlayGround(this.sprite, this.gameUi, mapElements);
		this.createdGround.show(this.ctx);
		this.playBtn.onclick = this.play.bind(this);
	}

	play() {
		this.mainCanvas.removeEventListener('mousemove', this.drawOnCanvas);
		this.itemCanvas.style.display = 'none';
		this.buttonHolder.style.display = 'none';
		this.onFinish(this.createdGround);
	}

	performValidation() {
		const array = this.mapElementArray;
		let doorCount = 0,
			trophyCount = 0,
			pipeCount = 0;
		const playerLocation = {};
		const trophyLocation = {};
		const doorLocation = {};

		for (let row = 0; row < array.length; row++) {
			for (let col = 0; col < array[row].length; col++) {
				if (array[row][col] === '0') {
					pipeCount++;
					playerLocation.x = col + 1;
					playerLocation.y = row;
					continue;
				}

				if (array[row][col] == '=') {
					doorLocation.x = col;
					doorLocation.y = row;
					doorCount++;
					continue;
				}

				if (array[row][col] == 't') {
					trophyLocation.x = col;
					trophyLocation.y = row;
					trophyCount++;
					continue;
				}
			}
		}

		if (pipeCount !== 1 || doorCount != 1 || trophyCount != 1) {
			this.gameUi.showAlert(
				'Door, Trophy and Entry pipe must exist and should be only 1'
			);
			return false;
		}

		if (!(array[playerLocation.y][playerLocation.x] == undefined)) {
			this.gameUi.showAlert('Dave cannot come outside of pipe');
			return false;
		}

		return true;
	}
}
