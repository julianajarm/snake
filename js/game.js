let game = {
    snake: undefined,
    settings: undefined,
    status: undefined,
    scoreManager: undefined,
    timer: undefined,
    renderer: undefined,
    food: undefined,
    speed: 1,
    tickInterval: null,
    foodRegenerateTimeout: null,

    init(userSettings = {}) {
        Object.assign(settings, userSettings);
        if (!settings.validate()) {
            return;
        }
        renderer.renderInitMap(settings.rowsCount, settings.colsCount);
        renderer.renderScoreBoard(3, 6);
        this.setEventHandlers();
        this.reset();
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());
        document.getElementById('newGameButton').addEventListener('click', () => this.newGameClickHandler());
        document.addEventListener('keydown', () => this.keyDownHandler(event));
    },

    playClickHandler() {
        if (status.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
    },

    keyDownHandler(event) {
        if (!status.isPlaying()) {
            return;
        }

        let direction = this.getDirectionByCode(event.code);
        if (this.canSetDirection(direction)) {
            snake.setDirection(direction);
        }

    },

    canSetDirection(direction) {
        return direction === 'up' && snake.lastStepDirection !== 'down' ||
            direction === 'right' && snake.lastStepDirection !== 'left' ||
            direction === 'down' && snake.lastStepDirection !== 'up' ||
            direction === 'left' && snake.lastStepDirection !== 'right';
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
        snake.init(this.getStartSnakePoint(), 'up');
        food.generate(this.getRandomCoordinates(), settings.foodVariants);
        renderer.render(snake.body, food);
        scoreManager.reset();
        renderer.renderScore(scoreManager);
        this.speed = settings.speed;
        timer.init(renderer);
    },

    incrementSpeed() {
        this.speed += 0.3;
        clearInterval(this.tickInterval);
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.speed);
    },

    play() {
        status.setPlaying();
        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.speed);
        this.changePlayButton('Пауза');
        timer.launch();
    },

    tickHandler() {
        if (!this.canSnakeMakeStep()) {
            this.finish();
            return;
        }

        if (food.isThere(snake.getNextStepHeadPoint())) {
            this.snakeEats();
        }

        snake.makeStep();
        renderer.render(snake.body, food);
    },

    isGameWon() {
        return scoreManager.getTotal() > settings.winScore;
    },

    pause() {
        status.setPaused();
        clearInterval(this.tickInterval);
        clearTimeout(this.foodRegenerateTimeout);
        timer.stop();
        this.changePlayButton('Старт');
    },

    finish() {
        status.setFinished();
        clearInterval(this.tickInterval);
        clearTimeout(this.foodRegenerateTimeout);
        timer.stop();
        this.changePlayButton('Игра закончена', true);
    },

    getStartSnakePoint() {
        return {
            x: Math.floor(settings.colsCount / 2),
            y: Math.floor(settings.rowsCount / 2)
        }
    },

    getRandomCoordinates() {
        let exclude = [food.getCoordinates(), ...snake.body];

        while (true) {
            let rndPoint = {
                x: Math.floor(Math.random() * settings.colsCount),
                y: Math.floor(Math.random() * settings.rowsCount)
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
        let nextHeadPoint = snake.getNextStepHeadPoint();

        return !snake.isBodyPoint(nextHeadPoint) &&
            nextHeadPoint.x < settings.colsCount &&
            nextHeadPoint.y < settings.rowsCount &&
            nextHeadPoint.x >= 0 &&
            nextHeadPoint.y >= 0;
    },

    snakeEats: function () {
        snake.incrementBody();
        scoreManager.increment(food.score);
        clearTimeout(this.foodRegenerateTimeout);
        this.foodRegenerate();
        this.incrementSpeed();
        renderer.renderScore(scoreManager);
        if (this.isGameWon()) {
            this.finish();
        }
    },

    foodRegenerate(){
        food.generate(this.getRandomCoordinates(), settings.foodVariants);
        renderer.render(snake.body, food);
        this.foodRegenerateTimeout = setTimeout( () => this.foodRegenerate(), food.lifetime);
    },
};

window.onload = function () {
    game.init({
        speed: 3,
        winScore: 50,
    });
};