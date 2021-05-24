class GroundGenerator {
	constructor(sprite, canvas) {
		this.canvas = canvas;
		let drawing = false;

		const ctx = canvas.getContext('2d');
		for (let i = 0; i < canvas.width; i += GRID_WIDTH) {
			for (let j = 0; j < canvas.height; j += GRID_HEIGHT) {
				ctx.fillStyle = '#891';
				ctx.fillRect(i, j, GRID_WIDTH - 1, GRID_HEIGHT - 1);
				ctx.closePath();
				ctx.fill();
			}
		}

		canvas.addEventListener('mousedown', function () {
			drawing = true;
		});

		canvas.addEventListener('mouseup', function () {
			drawing = false;
		});

		canvas.addEventListener('mousemove', function (e) {
			if (!drawing) return;
			const boundRect = canvas.getBoundingClientRect();
			const x = e.clientX - boundRect.left;
			const y = e.clientY - boundRect.top;
			const { row, col } = getGrid(
				{ x, y },
				{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
				{ x: 19, y: 10 }
			);

			ctx.fillStyle = 'red';
			ctx.fillRect(
				col * GRID_WIDTH,
				row * GRID_HEIGHT,
				GRID_WIDTH,
				GRID_HEIGHT
			);
		});
	}
}
