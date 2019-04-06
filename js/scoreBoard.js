let scoreBoard = {
    limit: null,
    // {name: '', time: null},
    results: [],

    init(limit){
        this.limit = limit;
        this.results = this.load().slice(0, this.limit);
    },

    load(){
        return JSON.parse(localStorage.getItem('scoreBoard') || "[]");
    },

    save() {
        localStorage.setItem('scoreBoard', JSON.stringify(this.results));
    },

    addResult(name, time) {
        let position = null;
        for ( let i = 0; i < this.results.length; i++) {
            if ( time < this.results[i].time ) {
                position = i;
                break;
            }
        }
        if (position === null) {
            position = this.results.length;
        }
        this.results.splice(position, 0, {name: name, time: time});
        this.results = this.results.slice(0, this.limit);
        this.save();
    },

    clear() {
        this.results = [];
        this.save();
    },

    getPlayers() {
        return this.results;
    },
};