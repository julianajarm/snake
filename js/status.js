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