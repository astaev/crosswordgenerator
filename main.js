let words = ['hello', 'world', 'task', 'interestingo', 'madrid', 'programming', 'korea'];
let grid;

function generatePuzzle() {
    const puzzle = new CrosswordPuzzle(words);
    puzzle.generateGrid();
    puzzle.printPuzzleToConsole();
    grid = puzzle.getGrid();

    const gridContainer = document.getElementById('grid');
    gridContainer.textContent = '';

    for (let row = 0; row < grid.size; row++) {
        for (let col = 0; col < grid.size; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `${row}_${col}`;
            const cellText = document.createTextNode(grid.getLetter(row, col) ?? ' ');
            cell.appendChild(cellText);
            gridContainer.appendChild(cell);

        }
        gridContainer.appendChild(document.createElement('br'));
    }
}