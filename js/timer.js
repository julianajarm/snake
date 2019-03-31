let timer = {
    renderer: null,
    sec: 0,
    interval: null,

    init(renderer) {
        this.renderer = renderer;
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
        this.renderer.renderTimer(this.sec);
    },
};