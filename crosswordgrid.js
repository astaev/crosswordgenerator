class CrosswordGrid {
    _gridSize = 20;
    _grid;
    _emptyChar = '*';

    constructor(size) {
        this._gridSize = size;
        this._grid = new Array(this._gridSize);
        this.initializeGrid();
    }

    get size() {
        return this._gridSize;
    }

    initializeGrid() {
        for (let x = 0; x < this._gridSize; x++) {
            this._grid[x] = new Array(this._gridSize);
            for (let y = 0; y < this._gridSize; y++) {
                this._grid[x][y] = this._emptyChar;
            }
        }
    }

    getLetter(row, col) {
        return this.isLetter(row, col) ? this._grid[row][col] : null;
    }

    addWord(word) {
        for (let i = 0; i < word.text.length; ++i) {
            let r = word.row;
            let c = word.col;
            if (word.vertical) {
                r += i;
            } else {
                c += i;
            }

            this._grid[r][c] = word.text.substring(i, i + 1);
        }
    }

    refresh(word) {
        let isUpdate = false;
        if (this.canBePlaced(word)) {
            isUpdate = true;
            this.addWord(word);
        }

        return isUpdate;
    }

    canBePlaced(word) {
        let canBePlaced = true;
        const checkBeforeStart = word.vertical ?
            this.isValidPosition(word.row - 1, word.col) && this.isEmptyCell(word.row - 1, word.col) :
            this.isValidPosition(word.row, word.col - 1) && this.isEmptyCell(word.row, word.col - 1);

        if (word.text && this.isValidPosition(word.row, word.col) && this.wordFits(word) && checkBeforeStart) {
            let index = 0;
            while (index < word.text.length) {
                let r = word.vertical ? word.row + index : word.row;
                let c = !word.vertical ? word.col + index : word.col;

                if ((word.text.charAt(index) === this._grid[r][c] || this.isEmptyCell(r, c)) &&
                    this.legalPlacement(word, r, c)) {
                    // canBePlaced = true;
                } else {
                    canBePlaced = false;
                }
                index++;
            }
        } else {
            canBePlaced = false;
        }

        return canBePlaced;
    }

    legalPlacement(word, row, col) {
        let illegal = true;
        if (word.vertical) {
            illegal = this.doesInterfer(row, col + 1, row + 1, col) ||
                this.doesInterfer(row, col - 1, row + 1, col) ||
                this.overwriteVerticalWord(row, col) ||
                this.isCrossing(word, col, row);
        } else {
            illegal = this.doesInterfer(row + 1, col, row, col + 1) ||
                this.doesInterfer(row - 1, col, row, col + 1) ||
                this.overwriteHorizontalWord(row, col) ||
                this.isCrossing(word, row, col);
        }

        return !illegal;
    }

    isCrossing(word, row, col) {
        let crossing = false;
        const isEmpty = this.isEmptyCell(row, col);
        let adjacent = true;
        if (word.vertical) {
            adjacent = (this.charExists(row, col - 1) || this.charExists(row, col + 1)) ||
                (this.isEndOfWord(word, row, col) && this.charExists(row + 1, col));

        } else {
            adjacent = (this.charExists(row - 1, col) || this.charExists(row + 1, col)) ||
                (this.isEndOfWord(word, row, col) && this.charExists(row, col + 1));
        }
        crossing = isEmpty && adjacent;

        return crossing;
    }

    isEndOfWord(word, row, col) {
        if (word.vertical) {
            return word.row + word.text.length - 1 === row;
        } else {
            return word.col + word.text.length - 1 === col;
        }
    }

    charExists(row, col) {
        return this.isValidPosition(row, col) && this.isLetter(row, col);
    }

    overwriteHorizontalWord(row, col) {
        const prevCol = col - 1;
        return this.isValidPosition(row, prevCol) && this.isLetter(row, col) && this.isLetter(row, prevCol);
    }

    overwriteVerticalWord(row, col) {
        const prevRow = row - 1;
        return this.isValidPosition(prevRow, col) && this.isLetter(row, col) && this.isLetter(prevRow, col);
    }

    doesInterfer(row, col, otherRow, otherCol) {
        return this.isValidPosition(row, col) &&
            this.isValidPosition(otherRow, otherCol) &&
            this.isLetter(row, col) &&
            this.isLetter(otherRow, otherCol);
    }

    isLetter(row, col) {
        return !this.isEmptyCell(row, col);
    }

    isEmptyCell(row, col) {
        return this._grid[row][col] === this._emptyChar;
    }

    wordFits(word) {
        if (word.vertical) {
            return word.row + word.text.length <= this._gridSize;
        } else {
            return word.col + word.text.length <= this._gridSize;
        }
    }

    isValidPosition(row, col) {
        return row >= 0 && row <= this._gridSize && col >= 0 && col <= this._gridSize;
    }

    getLettersCount() {
        let letters = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.isLetter(i, j)) {
                    letters++;
                }
            }
        }
        
        return letters;
    }
}