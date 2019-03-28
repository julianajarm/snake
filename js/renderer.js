let renderer = {
    cells: {}, // в нем лежат все ячейки {x0_y0}, они переданы объектами

    renderScore(scoreManager) {
        let counterPlace = document.getElementById('counter');
        counterPlace.innerHTML = `<p>Счёт: ${scoreManager.getTotal()} </p>`;//интерполяция строки
    },

    renderTimer(time) {
        let timerPlace = document.getElementById('timer');
        timerPlace.innerHTML = `<p>Время: ${time}</p>`
    },

    renderInitMap(rowsCount, colsCount) {
        let table = document.getElementById('game');
        table.innerHTML = '';

        for (let row = 0; row < rowsCount; row++) {
            let tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            for (let col = 0; col < colsCount; col++) {
                let td = document.createElement('td');
                td.classList.add('cell');
                tr.appendChild(td);
                this.cells[`x${col}_y${row}`] = td; // cells содержит все td
            }
        }
    },

    render(snakePointArray, food) {
        for (let key of Object.getOwnPropertyNames(this.cells)) {
            this.cells[key].className = 'cell';
            this.cells[key].innerHTML = '';
        }

        snakePointArray.forEach((point, idx) => {
            this.cells[`x${point.x}_y${point.y}`].classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
        });

        this.cells[`x${food.x}_y${food.y}`].insertAdjacentHTML("afterbegin", `<div class='food' style='background-color: ${food.color}'></div>`);
    },
};