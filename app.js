'use strict'
///////////////////////////////////////////////////////////////////////////////////////////////////
// Variables
let mineNumber = 0;
let widthHeight = [];
let cellsArray = [];
let mineLocation = [];
let aroundCells = []
let cleanAroundCells = []
///////////////////////////////////////////////////////////////////////////////////////////////////
// Set width , height & number of mines and Let's Play!
document.querySelector('.btn-play').addEventListener('click', function () {
    //////////////////////////////////////////////////////////////////////////////////////////////
    // width condition
    if (document.querySelector('.width').value >= 10 && document.querySelector('.width').value <= 30) {
        widthHeight.push(document.querySelector('.width').value);
    } else {
        document.querySelector('.width').value = 10;
        widthHeight.push(document.querySelector('.width').value)
        alert('Width is 10!')
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // height condition
    if (document.querySelector('.height').value >= 10 && document.querySelector('.width').value <= 30) {
        widthHeight.push(document.querySelector('.height').value);
    } else {
        document.querySelector('.height').value = 10;
        widthHeight.push(document.querySelector('.height').value)
        alert('Height is 10!')
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // minePercent condition
    if (document.querySelector('.mine-percent').value < 10 || document.querySelector('.mine-percent').value > 60) {
        document.querySelector('.mine-percent').value = 20;
        alert('Mine percent is 20%!')
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    // Calculate number of mines & set number of mines to game board.
    mineNumber = Math.trunc(widthHeight[0] * widthHeight[1] * document.querySelector('.mine-percent').value / 100);
    document.querySelector('.mine').textContent = mineNumber;
    //////////////////////////////////////////////////////////////////////////////////////////////
    // hidden init window
    document.querySelector('.overlay').classList.add('hidden');
    document.querySelector('.init-window').classList.add('hidden');
    //////////////////////////////////////////////////////////////////////////////////////////////
    // log (width,height,mines) (Temporary)
    console.log('Width: ' + widthHeight[0], 'Height: ' + widthHeight[1], 'Number of cells: ' + widthHeight[0] * widthHeight[1], 'Number of mines: ' + mineNumber);
    //////////////////////////////////////////////////////////////////////////////////////////////
    // call board function
    makeGrid(widthHeight[0], widthHeight[1]);
    //////////////////////////////////////////////////////////////////////////////////////////////
    // call Mine array function
    makeMinesArray(mineNumber)
    //////////////////////////////////////////////////////////////////////////////////////////////
    // change value of mine cells
    for (let i = 0; i < mineLocation.length; i++) {
        let val = document.querySelector(`.row${mineLocation[i][0]}Col${mineLocation[i][1]}`).value = -1;
        document.querySelector(`.row${mineLocation[i][0]}Col${mineLocation[i][1]}`).textContent = '💣';
    }
    //////////////////////////////////////////////////////////////////////////////////////////////
    //Increase Around cells by 1 (with for loop)
    for (let i = 0; i < mineLocation.length; i++) {
        for (let j = -1; j < 2; j++) {
            for (let z = -1; z < 2; z++) {
                let around = [mineLocation[i][0] - j, mineLocation[i][1] - z];
                aroundCells.push(around);
            }
        }
    }
    for (let i = 0; i < aroundCells.length; i++) {

        if (aroundCells[i][0] >= 0 && aroundCells[i][0] < widthHeight[0] && aroundCells[i][1] >= 0 && aroundCells[i][1] < widthHeight[1]) {
            if (document.querySelector(`.row${aroundCells[i][0]}Col${aroundCells[i][1]}`).value != -1) {
                let val = document.querySelector(`.row${aroundCells[i][0]}Col${aroundCells[i][1]}`).value += 1;
                // document.querySelector(`.row${aroundCells[i][0]}Col${aroundCells[i][1]}`).textContent = val;
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Right Click Function
    document.querySelectorAll('.board-grid-item').forEach(item => {
        item.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            if (item.textContent != "♠" || item.textContent != "🚩") {
                item.textContent += ""
            }

            if (item.textContent == '🚩') {
                item.textContent = '♠';
                document.querySelector('.mine').textContent = (document.querySelector('.mine').textContent) * 1 + 1;
            }
            else if (item.textContent == '♠') {
                item.textContent = '🚩'
                document.querySelector('.mine').textContent -= 1;
            };

            if (document.querySelector('.mine').textContent == -1) {
                if (item.textContent == '🚩') {
                    item.textContent = '♠';
                    document.querySelector('.mine').textContent = (document.querySelector('.mine').textContent) * 1 + 1;
                }
                else {
                    item.textContent += ''
                    document.querySelector('.mine').textContent -= 0;
                }
            };

        })
    })
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // Left Click Function
    document.querySelectorAll('.board-grid-item').forEach(item => {
        item.addEventListener('click', function () {
            //click the flag
            if (item.textContent == '🚩') {
                this.textContent += "";
            }
            // click the mine
            if (item.value == -1 & item.textContent != '🚩') {

                document.querySelector('.loose-screen').classList.remove('hidden');

                document.querySelector('body').classList.add('game-over');
                for (let i = 0; i < mineLocation.length; i++) {
                    document.querySelector(`.row${mineLocation[i][0]}Col${mineLocation[i][1]}`).textContent = '💣';
                }
                document.querySelector('.time-counter').textContent = time1;
                stopTimer()

            }
            // click on number
            if (item.value >= 1 && item.textContent != '🚩') {
                this.textContent = this.value
                this.classList.add('white-background')
            }
            // click empty 
            if (item.value == 0) {
                item.textContent = '';
                this.classList.add('white-background')

                let strRow = item.classList[1];
                strRow = strRow.substring(strRow.indexOf('w') + 1, strRow.indexOf('C'))

                let strCol = item.classList[1];
                strCol = strCol.substring(strCol.indexOf('l') + 1)

                let row = Number(strRow);
                let cal = Number(strCol);


                emptySpace(row, cal)
            }

            //Win the game

            let playedCells = [];
            for (let i = 0; i < cellsArray.length; i++) {
                if (document.querySelector(`.row${cellsArray[i][0]}Col${cellsArray[i][1]}`).textContent > 0 ||
                    document.querySelector(`.row${cellsArray[i][0]}Col${cellsArray[i][1]}`).textContent == '') {
                    playedCells.push(document.querySelector(`.row${cellsArray[i][0]}Col${cellsArray[i][1]}`).value)
                }
            }

            if (playedCells.length == cellsArray.length - mineLocation.length) {
                winner()
            }
        })
    })
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Start the timer
    startTimer();
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Click on looose screen
    document.querySelector('.loose-screen').addEventListener('click', function () {
        for (let i = 0; i < cellsArray.length; i++) {
            document.querySelector('.board-grid-item').remove();
        }
        mineNumber = 0;
        cellsArray.length = 0;
        widthHeight.length = 0;
        mineLocation.length = 0;
        aroundCells.length = 0;
        cleanAroundCells.length = 0;
        stopTimer();

        document.querySelector('.overlay').classList.remove('hidden');
        document.querySelector('.init-window').classList.remove('hidden');
        document.querySelector('body').classList.remove('game-over');
        document.querySelector('.loose-screen').classList.add('hidden');
    })
    ///////////////////////////////////////////////////////////////////////////////////////////////////
});
///////////////////////////////////////////////////////////////////////////////////////////////////
// Generate board (2D Array)
const container = document.getElementById("board-container");
function makeGrid(rows, cols) {
    container.style.setProperty('--grid-rows', rows);
    container.style.setProperty('--grid-cols', cols);
    let num = 500 - (cols - 10) * 10
    container.style.margin = "0 " + num + "px";
    for (let i = 0; i < (rows); i++) {
        for (let j = 0; j < (cols); j++) {
            cellsArray.push([i, j]);
            let cell = document.createElement("div");
            cell.innerText = "♠";
            container.appendChild(cell).className = 'board-grid-item';
            cell.value = 0;
            cell.classList.add(`row${i}Col${j}`)
        };
    };
};
///////////////////////////////////////////////////////////////////////////////////////////////////
// Generate an Array for Mines location! (2D Array)
function makeMinesArray(mNumber) {
    let indexNumber = [];
    for (let i = 0; i < cellsArray.length * 2; i++) {
        let randNumber = Math.trunc(Math.random() * cellsArray.length);
        if (indexNumber.includes(randNumber) == false) {
            indexNumber.push(randNumber)
        }
    }
    let counter = 0;
    while (mNumber != mineLocation.length) {
        mineLocation.push(cellsArray[indexNumber[counter]]);
        counter += 1;
    }
    mineLocation.sort()
}
///////////////////////////////////////////////////////////////////////////////////////////////////
// empty space recuirsive 
let rcsv = []
function emptySpace(r, c) {
    let around = [[r - 1, c - 1], [r, c - 1], [r + 1, c - 1], [r - 1, c], [r + 1, c], [r - 1, c + 1], [r, c + 1], [r + 1, c + 1]]
    for (let j = 0; j < around.length; j++) {
        if (around[j][0] >= 0 && around[j][0] < widthHeight[0] && around[j][1] >= 0 && around[j][1] < widthHeight[1]) {
            if (document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).value > 0) {
                document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).textContent = document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).value;
                document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).classList.add('white-background')
                // document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).value = 10;
            }
            else if (document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).value == 0 && document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).textContent == '♠') {
                let rcsv = []
                rcsv.push(around[j]);
                document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).classList.add('white-background')
                document.querySelector(`.row${around[j][0]}Col${around[j][1]}`).textContent = "";
                for (let z = 0; z < rcsv.length; z++) {
                    emptySpace(rcsv[z][0], rcsv[z][1])
                }
            }
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////////////////
// New Game Button
document.querySelector('.btn-newgame').addEventListener('click', newGame)
///////////////////////////////////////////////////////////////////////////////////////////////////
// Functions to starting and stopimg timer
let timer;
let time1;
let Score;
function startTimer() {
    time1 = 1;

    if (timer) {
        stopTimer();
    };
    timer = setInterval(function () {
        document.querySelector('.time-counter').textContent = time1;
        time1++;
    },
        1000
    );
}
function stopTimer() {
    clearInterval(timer);

}
///////////////////////////////////////////////////////////////////////////////////////////////////
// Winnig
function winner() {
    alert('You Win!!!')
    let recorder = prompt('Enter Your Name: ')

    stopTimer()
    alert('You can see records on Local Storage')
    newGame()
}
///////////////////////////////////////////////////////////////////////////////////////////////////
// WNew Game function
function newGame() {
    for (let i = 0; i < cellsArray.length; i++) {
        document.querySelector('.board-grid-item').remove();
    }
    mineNumber = 0;
    cellsArray.length = 0;
    widthHeight.length = 0;
    mineLocation.length = 0;
    aroundCells.length = 0;
    cleanAroundCells.length = 0;
    stopTimer();

    document.querySelector('.overlay').classList.remove('hidden');
    document.querySelector('.init-window').classList.remove('hidden');
    document.querySelector('body').classList.remove('game-over');
}