/**
 * Takes CSS selectors as input and returns corresponding Node or NodeList.
 * @param  {string} selector CSS selector
 *
 * @returns DOM element(s) corresponding to selector
 */
function $(selector) {
	var nodeList = document.querySelectorAll(selector);
	if (nodeList.length == 1) return nodeList[0];

	return nodeList;
}

/**
 * generates random number between interval [a,b] or array.
 * @param {number} a lowerInterval value or an array
 * @param {number} b upperInterval value
 *
 * @returns random number between a and b or random element from array a
 */
function random(a, b = 0) {
	if (a instanceof Array) return a[randomInt(a.length - 1)];

	return Math.random() * (b - a) + a;
}

/**
 * returns rounded integer between two numbers.
 */
function randomInt(a, b = 0) {
	return Math.round(random(a, b));
}

/**
 * Calculates distance between two points.
 * @parms {object} p1 point in 2d-coordinate
 * @param {object} p2 point in 2d co-ordinate
 * @returns distance between p1 and p2
 */
function getDistance(p1, p2) {
	const diffX = p1.x - p2.x;
	const diffY = p1.y - p2.y;

	return Math.sqrt(diffX ** 2 + diffY ** 2);
}

/**
 * Calculates distance between two points.
 * @parms {number} x x-coordinate in 2d-coordinate system
 * @param {number} y y-coordinate in 2d co-ordinate system
 * @parms {number} sw width of screen
 * @parms {number} sh height of screen
 *
 * @returns {number} indexValue for 4 quardants
 */
function getQuardant(x, y, sw, sh) {
	if (x <= sw / 2 && y <= sh / 2) {
		return 0; //Index for 1st quardant
	}
	if (x <= sw / 2 && y > sh / 2) {
		return 1; //Index for 2nd quardant
	}
	if (x > sw / 2 && y <= sh / 2) {
		return 2; //Index for 3rd quardant
	}
	if (x > sw / 2 && y > sh / 2) {
		return 3; //Index for 4th quardant
	}
}

/**
 *
 * @param {Array} array of Object or numbers
 * @returns
 */
function getUnique(array) {
	if (array instanceof Array) return [...new Set(array.map((x) => x))];
}

function checkCollision(obj1, obj2) {
	const leftCollision = obj1.x < obj2.x + obj2.width;
	const rightCollision = obj1.x + obj1.width > obj2.x;
	const topCollision = obj1.y < obj2.y + obj2.height;
	const bottomCollision = obj1.y + obj1.height > obj2.y;

	const horizantalCheck = leftCollision && rightCollision;
	const verticalCheck = topCollision && bottomCollision;

	let status = false;
	if (horizantalCheck && verticalCheck) {
		status = true;
		if (topCollision) return { status, direction: 't' };
		if (rightCollision) return { status, direction: 'r' };
		if (bottomCollision) return { status, direction: 'b' };
		if (leftCollision) return { status, direction: 'l' };
	}

	return { status, direction: 'none' };
}

function getRandomColor(options) {
	if (options) return random(options);

	const red = randomInt(0, 255);
	const green = randomInt(0, 255);
	const blue = randomInt(0, 255);

	return `rgb(${red},${green},${blue})`;
}
