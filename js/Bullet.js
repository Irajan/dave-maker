class Bullet {
	constructor(x, y, dir) {
		this.x = x;
		this.y = y;
		this.dir = dir;
	}

	update() {
		if (this.dir == 'left') {
			this.x -= 1;
			return;
		}
		if (this.dir == 'right') {
			this.x += 1;
			return;
		}
	}

	draw(ctx) {
		ctx.drawRect(this.x, this.y, 10, 5);
	}
}
