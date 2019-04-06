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
    isFinished(){
        return this.state === 'finished';
    },
    isPlaying() {
        return this.state === 'playing';
    },
    reset() {
        this.state = null;
    },
};