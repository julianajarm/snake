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