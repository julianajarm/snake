let game = {
    snake,
    settings,
    status,
    scoreManager,
    timer,
    renderer,
    food,
    scoreBoard,
    speed: 1,
    tickInterval: null,
    foodRegenerateTimeout: null,

    init(userSettings = {}) {
        Object.assign(this.settings, userSettings);
        if (!this.settings.validate()) {
            return;
        }
        this.scoreBoard.init(this.settings.topLimit);
        this.renderer.renderInitMap(this.settings.rowsCount, this.settings.colsCount);
        this.renderer.renderScoreBoard(this.scoreBoard);
        this.setEventHandlers();
        this.reset();
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());
        document.getElementById('newGameButton').addEventListener('click', () => this.newGameClickHandler());
        document.addEventListener('keydown', () => this.keyDownHandler(event));
    },

    playClickHandler() {
        if (this.status.isFinished()) {
            return;
        } else if (this.status.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
        this.changePlayButton('Старт');
    },

    keyDownHandler(event) {
        if (!this.status.isPlaying()) {
            return;
        }

        let direction = this.getDirectionByCode(event.code);
        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }

    },

    canSetDirection(direction) {
        return direction === 'up' && this.snake.lastStepDirection !== 'down' ||
            direction === 'right' && this.snake.lastStepDirection !== 'left' ||
            direction === 'down' && this.snake.lastStepDirection !== 'up' ||
            direction === 'left' && this.snake.lastStepDirection !== 'right';
    },

    getDirectionByCode(code) {
        switch (code) {
            case 'KeyW':
            case 'ArrowUp':
                return 'up';
            case 'KeyD':
            case 'ArrowRight':
                return 'right';
            case 'KeyS':
            case 'ArrowDown':
                return 'down';
            case 'KeyA':
            case 'ArrowLeft':
                return 'left';
            default:
                return '';
        }
    },

    reset() {
        this.snake.init(this.getStartSnakePoint(), 'up');
        this.food.generate(this.getRandomCoordinates(), this.settings.foodVariants);
        this.renderer.render(this.snake.body, this.food);
        this.scoreManager.reset();
        this.renderer.renderScore(this.scoreManager);
        this.speed = this.settings.speed;
        this.timer.init(this.renderer);
        this.status.reset();
    },

    incrementSpeed() {
        this.speed += 0.3;
        clearInterval(this.tickInterval);
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.speed);
    },

    play() {
        this.status.setPlaying();
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.speed);
        this.changePlayButton('Пауза');
        this.timer.launch();
    },

    tickHandler() {
        if (!this.canSnakeMakeStep()) {
            this.finish(false);
            return;
        }

        if (this.food.isThere(this.snake.getNextStepHeadPoint())) {
            this.snakeEats();
        }

        this.snake.makeStep();
        this.renderer.render(this.snake.body, this.food);

        if (this.isGameWon()) {
            this.finish(true);
        }
    },

    isGameWon() {
        return this.scoreManager.getTotal() >= this.settings.winScore;
    },

    pause() {
        this.status.setPaused();
        clearInterval(this.tickInterval);
        clearTimeout(this.foodRegenerateTimeout);
        this.timer.stop();
        this.changePlayButton('Старт');
    },

    finish(isWon) {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        clearTimeout(this.foodRegenerateTimeout);
        this.timer.stop();
        this.changePlayButton('Игра закончена', true);
        if (isWon) {
            setTimeout(() => this.saveResult(), 100);
        }
    },

    saveResult() {
        let username = prompt("Введите свое имя:");
        this.scoreBoard.addResult(username, this.timer.sec);
        this.renderer.renderScoreBoard(this.scoreBoard);
    },

    getStartSnakePoint() {
        return {
            x: Math.floor(this.settings.colsCount / 2),
            y: Math.floor(this.settings.rowsCount / 2)
        }
    },

    getRandomCoordinates() {
        let exclude = [this.food.getCoordinates(), ...this.snake.body];

        while (true) {
            let rndPoint = {
                x: Math.floor(Math.random() * this.settings.colsCount),
                y: Math.floor(Math.random() * this.settings.rowsCount)
            };

            let excludeContainsRndPoint = exclude.some(function (exPoint) {
                return rndPoint.x === exPoint.x && rndPoint.y === exPoint.y;
            });

            if (!excludeContainsRndPoint) {
                return rndPoint;
            }
        }
    },

    changePlayButton(textContent, isDisabled = false) {
        let playButton = document.getElementById('playButton');
        playButton.textContent = textContent;
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },

    canSnakeMakeStep() {
        let nextHeadPoint = this.snake.getNextStepHeadPoint();

        return !this.snake.isBodyPoint(nextHeadPoint) &&
            nextHeadPoint.x < this.settings.colsCount &&
            nextHeadPoint.y < this.settings.rowsCount &&
            nextHeadPoint.x >= 0 &&
            nextHeadPoint.y >= 0;
    },

    snakeEats: function () {
        this.snake.incrementBody();
        this.scoreManager.increment(this.food.score);
        clearTimeout(this.foodRegenerateTimeout);
        this.foodRegenerate();
        this.incrementSpeed();
        this.renderer.renderScore(this.scoreManager);
    },

    foodRegenerate(){
        this.food.generate(this.getRandomCoordinates(), this.settings.foodVariants);
        this.renderer.render(this.snake.body, this.food);
        this.foodRegenerateTimeout = setTimeout( () => this.foodRegenerate(), this.food.lifetime);
    },
};
