let timer = {
    renderer: null,
    sec: 0,
    interval: null,

    init(renderer) {
        renderer = this.renderer;
        this.sec = 0;
        this.render();
    },

    launch(){
        this.interval = setInterval(() => this.tick(), 1000);
    },

    tick(){
        this.sec++;
        this.render();
    },

    stop(){
        clearInterval(this.interval);
    },

    render() {
        renderer.renderTimer(this.toString());
    },

    toString() {
        let sec = this.sec % 60;
        let min = Math.trunc(this.sec / 60);

        if (sec < 10) {
            sec = `0${sec}`;
        }
        if (min < 10) {
            min = `0${min}`
        }

        return `${min}:${sec}`;
    },

};