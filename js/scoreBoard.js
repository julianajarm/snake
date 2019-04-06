let scoreBoard = {
    limit: null,
    // {name: '', time: null},
    results: [],

    init(limit){
        this.limit = limit;
        this.results = this.load().slice(0, this.limit);
    },

    load(){
        return [
            {name: 'Mark', time: 50},
            {name: 'Max', time: 55},
            {name: 'Mary', time: 59},
            {name: 'Margo', time: 60},
            {name: 'March', time: 60},
        ];
    },

    addResult(name, time) {

        for ( let i = 0; i < this.results.length; i++) {
            if ( time < this.results[i].time ) {
                this.results.splice(i, 0, {name: name, time: time});
                this.results = this.results.slice(0, this.limit);
                return;
            }
        }
    },

    getPlayers() {
        // let player = prompt('Enter username:');
        return this.results;
    },
};