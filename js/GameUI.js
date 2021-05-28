class GameUI {
	constructor(container) {
		this.container = container;
		this.mainMenu = container.querySelector('.main-menu');
		this.gameScreen = document.createElement('canvas');
		this.itemCanvas = document.createElement('canvas');

		this.alertBox = document.createElement('div');
		this.alertBox.classList.add('alert-box');

		this.container.appendChild(this.gameScreen);
		this.container.appendChild(this.alertBox);

		//DOM to display score life and level
		const wrapper = document.createElement('div');
		this.wrapper = wrapper;

		wrapper.classList.add('wrapper');

		const scoreWrapper = document.createElement('div');
		const levelWrapper = document.createElement('div');
		const lifeWrapper = document.createElement('div');

		const score = document.createElement('span');
		const level = document.createElement('span');
		const life = document.createElement('span');

		score.classList.add('score-text');
		level.classList.add('level-text');
		life.classList.add('life-text');

		scoreWrapper.innerHTML = 'Score : ';
		levelWrapper.innerHTML = 'Level : ';
		lifeWrapper.innerHTML = 'Daves Left : ';

		scoreWrapper.appendChild(score);
		levelWrapper.appendChild(level);
		lifeWrapper.appendChild(life);

		scoreWrapper.classList.add('score-wrapper');
		levelWrapper.classList.add('level-wrapper');
		lifeWrapper.classList.add('life-wrapper');

		wrapper.appendChild(scoreWrapper);
		wrapper.appendChild(levelWrapper);
		wrapper.appendChild(lifeWrapper);

		this.scoreHolder = score;
		this.levelHolder = level;
		this.lifeHolder = life;
		this.wrapper = wrapper;

		this.alertBox.onclick = () => {
			this.alertBox.classList.remove('show');
		};
	}

	hideMenu() {
		this.mainMenu.style.display = 'none';
	}
	showMenu() {
		this.mainMenu.style.display = 'block';
	}

	hideElement(element) {
		element.style.display = 'none';
	}

	hideContainer() {
		this.container.children[0].style.display = 'none';
	}
	hideWrapper() {
		this.wrapper.style.display = 'none';
	}

	showWrapper() {
		this.container.appendChild(this.wrapper);
	}

	setScore(score) {
		this.scoreHolder.innerHTML = score;
	}

	setLife(life) {
		this.lifeHolder.innerHTML = life;
	}

	setLevel(level) {
		this.levelHolder.innerHTML = level;
	}

	showGameScreen() {
		this.gameScreen.style.display = 'block';
	}

	addClass(element, className) {
		element.classList.add(className);
	}

	createButton(text = 'button') {
		const btn = document.createElement('button');
		btn.innerHTML = text;
		return btn;
	}

	addElement(element, parent = this.container) {
		parent.appendChild(element);
	}

	write(element, text) {
		element.innerHTML = text;
	}

	showItemCanvas() {
		this.itemCanvas.style.display = 'block';
	}

	getGameScreen() {
		return this.gameScreen;
	}

	showAlert(alertMessage) {
		this.alertBox.innerHTML = alertMessage;
		this.alertBox.classList.add('show');
	}
	createBackToMenu() {
		const btn = document.createElement('button');
		btn.innerHTML = 'Back';
		btn.addEventListener('click', () => {
			const childrens = this.container.children;
			for (let child of childrens) {
				child.style.display = 'none';
			}
			this.showMenu();
		});
		return btn;
	}
}
