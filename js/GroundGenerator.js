class GroundGenerator {
	constructor(sprite, container) {
		this.sprite = sprite;
		this.container = container;
		this.createdGround = null;

		this.canvas = document.createElement('canvas');
		this.isDrawing = false;

		let ctx;
		this.ctx = ctx = this.canvas.getContext('2d');
		this.images = new Array();
		this.mapElementArray;

		this.selectedItemIndex = 0;

		this.rows = 10;
		this.cols = 19;

		this.canvas.width = GRID_WIDTH * this.cols;
		this.canvas.height = GRID_HEIGHT * (this.rows + 1);
		for (let i = 0; i < this.cols * GRID_WIDTH; i += GRID_WIDTH) {
			for (let j = 0; j < this.rows * GRID_HEIGHT; j += GRID_HEIGHT) {
				ctx.fillStyle = '#891';
				ctx.fillRect(i, j, GRID_WIDTH - 1, GRID_HEIGHT - 1);
				ctx.closePath();
				ctx.fill();
			}
		}

		window.addEventListener('mousedown', () => {
			this.isDrawing = true;
		});

		window.addEventListener('mouseup', () => {
			this.isDrawing = false;
		});

		const sceneElements = this.sprite.sceneElements;
		let drawIndex = 0;
		for (let currentKey in sceneElements) {
			const imageClip = sceneElements[currentKey];

			if (!imageClip.location) continue;

			const sx = imageClip.location[0].x;
			const sy = imageClip.location[0].y;
			const sw = imageClip.width;
			const sh = imageClip.height;
			const dx = drawIndex * GRID_WIDTH + 2;
			const dy = this.rows * GRID_HEIGHT + 2;
			const dw = GRID_WIDTH - 2;
			const dh = GRID_HEIGHT - 2;

			ctx.drawImage(this.sprite.image, sx, sy, sw, sh, dx, dy, dw, dh);
			this.images[drawIndex++] = imageClip;
		}

		this.container.innerHTML = '';

		this.container.appendChild(this.canvas);
	}

	init() {
		const createBtn = document.createElement('button');
		createBtn.innerHTML = 'Create';
		this.container.appendChild(createBtn);

		createBtn.disabled = true;
		createBtn.addEventListener('click', this.create.bind(this));

		const ctx = this.ctx;
		this.mapElementArray = new Array(this.rows);

		for (let i = 0; i < this.rows; i++) {
			this.mapElementArray[i] = new Array(this.cols);
		}

		this.canvas.addEventListener('mousemove', (e) => {
			const boundRect = e.target.getBoundingClientRect();
			const x = e.clientX - boundRect.left;
			const y = e.clientY - boundRect.top;

			if (!this.isDrawing || y >= GRID_HEIGHT * this.rows) return;
			createBtn.disabled = false;

			const imageItem = this.images[this.selectedItemIndex];
			const gridX = Math.floor(x / GRID_WIDTH);
			const gridY = Math.floor(y / GRID_HEIGHT);

			const sx = imageItem.location[0].x;
			const sy = imageItem.location[0].y;
			const sw = imageItem.width;
			const sh = imageItem.height;
			const dx = gridX * GRID_WIDTH;
			const dy = gridY * GRID_HEIGHT;
			const dw = GRID_WIDTH;
			const dh = GRID_HEIGHT;

			ctx.drawImage(this.sprite.image, sx, sy, sw, sh, dx, dy, dw, dh);
			this.mapElementArray[gridY][gridX] = imageItem.code;
		});

		this.canvas.addEventListener('click', (e) => {
			const boundRect = e.target.getBoundingClientRect();
			const x = e.clientX - boundRect.left;
			const y = e.clientY - boundRect.top;

			if (y > this.rows * GRID_HEIGHT) {
				ctx.strokeStyle = '#000';
				ctx.stroke();

				this.selectedItemIndex = Math.floor(x / GRID_WIDTH);

				if (this.selectedItemIndex >= this.images.length) {
					return;
				}

				ctx.beginPath();
				ctx.lineWidth = 5;
				ctx.strokeStyle = 'red';
				ctx.rect(
					GRID_WIDTH * this.selectedItemIndex,
					GRID_HEIGHT * this.rows,
					GRID_WIDTH,
					GRID_HEIGHT
				);
				ctx.closePath();
				ctx.stroke();
			}
		});
	}

	create() {
		const playBtn = document.createElement('button');
		playBtn.innerHTML = 'Play';
		this.container.appendChild(playBtn);

		const mapElements = [];
		mapElements.push(this.mapElementArray);

		if (this.createdGround !== null) {
			this.createdGround.removeAllObjects();
		}
		this.createdGround = new PlayGround(this.sprite, mapElements);
		this.createdGround.show(this.ctx);
		playBtn.onclick = this.play.bind(this);
	}

	play() {
		this.onFinish(this.createdGround);
	}
}
