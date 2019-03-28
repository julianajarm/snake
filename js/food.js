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