let actualScore = 0;
let matrix = Array(16).fill(null); // this will represent the grid
const colorMap = {
    2: 'var(--cell2)',
    4: 'var(--cell4)',
    8: 'var(--cell8)',
    16: 'var(--cell16)',
    32: 'var(--cell32)',
    64: 'var(--cell64)',
    128: 'var(--cell128)',
    256: 'var(--cell256)',
    512: 'var(--cell512)',
    1024: 'var(--cell1024)',
    2048: 'var(--cell2048)',   
};

function renderGrid() {
    const gridContainer = document.querySelector('.grid-container');
    gridContainer.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.id = i + 1;
        if (matrix[i] !== null) {
            cell.textContent = matrix[i];
            cell.style.backgroundColor = colorMap[matrix[i]];
            if (matrix[i] > 4)
                cell.style.color = 'white';
        }
        gridContainer.appendChild(cell);
    }
}

function addNewNumber(total) {
    let count = 0;
    while (count < total) {
        const randomIndex = Math.floor(Math.random() * 16);
        if (matrix[randomIndex] === null) { // Verifica si la posición está vacía
            matrix[randomIndex] = 2;
            count++;
        }
    }
    renderGrid();
}

function initGame() {
    matrix.fill(null);
    addNewNumber(2);
    handleGame();
}

// restart event listener
const restartBtn = document.getElementById('restart-btn');
restartBtn.addEventListener('click', initGame);

function handleGame() {
    const score = document.getElementById('score-value');
    document.addEventListener('keydown', (event) => {
        let moved = false;
        if (event.key === 'ArrowUp') {
            moved = moveY('up');
        } else if (event.key === 'ArrowDown') {
            moved = moveY('down');
        } else if (event.key === 'ArrowLeft') {
            moved = moveX('left');
        } else if (event.key === 'ArrowRight') {
            moved = moveX('right');
        }
        if (moved) {
            addNewNumber(1);
            renderGrid();
            score.textContent = actualScore;

        }
    });
}

function compress(row) { 
    let newRow = row.filter(value => value !== null); // this will remove all null values
    newRow = newRow.concat(Array(4 - newRow.length).fill(null)); // this will add the missing null values
    return (newRow);
    // return (row.filter(value => value !== null).concat(Array(4 - row.filter(value => value !== null).length).fill(null)));
}

function merge(row) {
    for (let i = 0; i < 3; i++) {
        if (row[i] !== null && row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = null;
            actualScore += row[i];
        }
    }
    return compress(row);
}

function moveX(direction) {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let start = i * 4;
        let row = matrix.slice(start, start + 4);
        let newRow = [...row]; // ... extracts the elements of the array
        if (direction === 'right')
            newRow.reverse();
        newRow = compress(newRow);
        newRow = merge(newRow);
        newRow = compress(newRow);
        if (direction === 'right')
            newRow.reverse();
        for (let j = 0; j < 4; j++) {
            matrix[start + j] = newRow[j];
        }
        if (JSON.stringify(newRow) !== JSON.stringify(row))
            moved = true;
    }
    return (moved);
}

function moveY(direction) {
    let moved = false;

    for (let j = 0; j < 4; j++) {
        let col = [];
        for (let i = 0; i < 4; i++) {
            col.push(matrix[i * 4 + j]);
        }
        let newCol = [...col];
        if (direction === 'down')
            newCol.reverse();
        newCol = compress(newCol);
        newCol = merge(newCol);
        newCol = compress(newCol);
        if (direction === 'down')
            newCol.reverse();
        for (let i = 0; i < 4; i++) {
            matrix[i * 4 + j] = newCol[i];
        }
        if (JSON.stringify(newCol) !== JSON.stringify(col))
            moved = true;
    }
    return (moved);
}


initGame();
