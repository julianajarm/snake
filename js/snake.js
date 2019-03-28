
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



