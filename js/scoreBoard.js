let scoreBoard = {
    limit: null,
    // {name: '', time: null},
    players: [],

    init(limit){
        this.limit = limit;
        let players = this.load();
        this.players = players.slice(0, limit);
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

    addPlayer(name, time) {
        this.players.push({name: name, time: time});
    },

    getPlayers() {
        // let player = prompt('Enter username:');
        return this.players;
    },
};