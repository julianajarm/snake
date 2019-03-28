let settings = {
    rowsCount: 21,
    colsCount: 21,
    speed: 3,
    winScore: 10, //какой длины должна быть змейка для победы
    foodVariants: [
        {score: 1, color: 'green', lifetime: 5000},
        {score: 2, color: 'blue', lifetime: 4000},
        {score: 3, color: 'orange', lifetime: 3000},
    ],


    validate() {
        if (this.rowsCount < 10 || this.rowsCount > 30) {
            console.error('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
            return false;
        }

        if (this.colsCount < 10 || this.colsCount > 30) {
            console.error('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
            return false;
        }

        if (this.speed < 0.5 || this.speed > 10) {
            console.error('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
            return false;
        }

        if (this.winScore < 5 || this.winScore > 50) {
            console.error('Неверные настройки, значение winScore должно быть в диапазоне [5, 50].');
            return false;
        }

        return true;
    },
};