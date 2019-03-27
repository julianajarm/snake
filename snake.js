
"use strict";

let snake = {
    body: null,
    direction: null,
    lastStepDirection: null,

    init(startPoint, direction) {
        this.body = [startPoint];
        this.direction = direction;
    },

    makeStep() {
        this.lastStepDirection = this.direction;
        this.body.unshift(this.getNextStepHeadPoint());
        this.body.pop();
    },

    getNextStepHeadPoint() {
        let firstPoint = this.body[0];

        switch (this.direction) {
            case 'up':
                return {
                    x: firstPoint.x,
                    y: firstPoint.y - 1
                };
            case 'down':
                return {
                    x: firstPoint.x,
                    y: firstPoint.y + 1
                };
            case 'right':
                return {
                    x: firstPoint.x + 1,
                    y: firstPoint.y
                };
            case 'left':
                return {
                    x: firstPoint.x - 1,
                    y: firstPoint.y
                };
        }
    },

    isBodyPoint(point) {
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },

    setDirection(direction) {
        this.direction = direction;
    },

    incrementBody() {
        let lastBodyIdx = this.body.length - 1;
        let lastBodyPoint = this.body[lastBodyIdx];
        let lastBodyPointClone = Object.assign({}, lastBodyPoint);
        this.body.push(lastBodyPointClone);
    }

};

let food = {
    x: null,
    y: null,
    score: 0,
    color: null,
    lifetime: 0,

    generate(point, variants) {
        this.setCoordinates(point);
        let config = variants[Math.floor(Math.random()*variants.length)];
        this.score = config.score;
        this.color = config.color;
        this.lifetime = config.lifetime;
    },

    setCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    getCoordinates() {
        return {
            x: this.x,
            y: this.y
        }
    },

    isThere(point) {
        return this.x === point.x && this.y === point.y;
    }
};

let renderer = {
    cells: {}, // в нем лежат все ячейки {x0_y0}, они переданы объектами

    renderScore(scoreManager) {
        let counterPlace = document.getElementById('counter');
        counterPlace.innerHTML = `<p>Счёт: ${scoreManager.getTotal()} </p>`;//интерполяция строки
    },

    renderInitMap(rowsCount, colsCount) {
        let table = document.getElementById('game');
        table.innerHTML = '';

        for (let row = 0; row < rowsCount; row++) {
            let tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                let td = document.createElement('td');
                td.classList.add('cell');
                tr.appendChild(td);
                this.cells[`x${col}_y${row}`] = td; // cells содержит все td
            }
        }
    },

    render(snakePointArray, food) {
        for (let key of Object.getOwnPropertyNames(this.cells)) {
            this.cells[key].className = 'cell';
            this.cells[key].innerHTML = '';
        }

        snakePointArray.forEach((point, idx) => {
            this.cells[`x${point.x}_y${point.y}`].classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
        });

        this.cells[`x${food.x}_y${food.y}`].insertAdjacentHTML("afterbegin", `<div class='food' style='background-color: ${food.color}'></div>`);
    },
};

// let timer = {
//     time: 0,
//
//     renderer() {
//         let timer = document.getElementById('timer');
//         let sec = 0;
//         this.time = setInterval
//     },
//
// };

let status = {
    state: null,

    setPlaying() {
        this.state = 'playing';
    },
    setPaused() {
        this.state = 'paused';
    },
    setFinished() {
        this.state = 'finished';
    },
    isPlaying() {
        return this.state === 'playing';
    },
    isPaused() {
        return this.state === 'paused';
    },

};

let settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 3,
    winScore: 10, //какой длины должна быть змейка для победы
    foodVariants: [
        {score: 1, color: 'green', lifetime: 5000},
        {score: 2, color: 'blue', lifetime: 4000},
        {score: 3, color: 'orange', lifetime: 3000},
    ],


    validate() {
        if (this.rowsCount < 10 || this.rowsCount > 30) {
            console.error('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
            return false;
        }

        if (this.colsCount < 10 || this.colsCount > 30) {
            console.error('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
            return false;
        }

        if (this.speed < 0.5 || this.speed > 10) {
            console.error('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
            return false;
        }

        if (this.winScore < 5 || this.winScore > 50) {
            console.error('Неверные настройки, значение winScore должно быть в диапазоне [5, 50].');
            return false;
        }

        return true;
    },
};

let scoreManager = {
    counter: 0,

    increment(count) {
        this.counter += count;
    },

    getTotal() {
        return this.counter;
    },

    reset() {
        this.counter = 0;
    }
};

let game = {
    settings,
    status,
    renderer,
    food,
    snake,
    scoreManager,
    speed: 1,
    tickInterval: null,
    foodRegenerateTimeout: null,

    init(userSettings = {}) {
        Object.assign(this.settings, userSettings); //если в userSettings ничего не будет, он будет пустой, то ничего не произойдет, но если передать скорость 5, она обновится и в массиве сеттингс

        if (!this.settings.validate()) {
            return;
        }

        this.renderer.renderInitMap(this.settings.rowsCount, this.settings.colsCount);

        this.setEventHandlers();

        this.reset();
    },

    setEventHandlers() {
        document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());
        document.getElementById('newGameButton').addEventListener('click', () => this.newGameClickHandler());
        document.addEventListener('keydown', () => this.keyDownHandler(event));
    },

    playClickHandler() {
        if (this.status.isPlaying()) {
            this.pause();
        } else {
            this.play();
        }
    },

    newGameClickHandler() {
        this.reset();
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

        this.setTimer();
    },

    setTimer() {
        let timer = document.getElementById('timer');
        let sec = 0;
        let min = 0;
        this.timer = setInterval(function () {
            sec++;
            if (sec > 59) {
                min++;
            }
            timer.innerHTML=`<p>${min}:${sec}</p>`;
        }, 1000);
    },

    tickHandler() {
        if (!this.canSnakeMakeStep()) {
            this.finish();
            return;
        }

        if (this.food.isThere(this.snake.getNextStepHeadPoint())) {
            this.snakeEats();
        }

        this.snake.makeStep();
        this.renderer.render(this.snake.body, this.food);
    },

    isGameWon() {
        return this.scoreManager.getTotal() > this.settings.winScore;
    },

    pause() {
        this.status.setPaused();
        clearInterval(this.tickInterval);
        clearTimeout(this.foodRegenerateTimeout);
        this.changePlayButton('Старт');
    },

    finish() {
        this.status.setFinished();
        clearInterval(this.tickInterval);
        clearTimeout(this.foodRegenerateTimeout);
        this.changePlayButton('Игра закончена', true);
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
        if (this.isGameWon()) {
            this.finish();
        }
    },

    foodRegenerate(){
        this.food.generate(this.getRandomCoordinates(), this.settings.foodVariants);
        this.renderer.render(this.snake.body, this.food);
        this.foodRegenerateTimeout = setTimeout( () => this.foodRegenerate(), this.food.lifetime);
    },
};

window.onload = function () {
    game.init({
        speed: 3,
        winScore: 50,
    });
};

