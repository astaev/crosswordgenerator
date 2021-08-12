class CrosswordPuzzle {
    words = [];
    usedWords = [];
    generatedGrids = [];
    goodStartingLetters = new Set();
    wordOrientation; // true for vertical, otherwise horizontal

    constructor(words) {
        this.words = words;
        this.randomOrientation();
    }

    generateGrid() {
        this.generatedGrids = [];
        for (let gridsCount = 0; gridsCount < 10; gridsCount++) {
            this.wordOrientation = undefined;
            let grid = new CrosswordGrid(25);
            let word = new Word(this.getLongestWord(), 5, 5, this.getOrientation());

            grid.refresh(word);
            this.pushUsedWords(word.text);

            let fails = 0;
            for (let attempt = 0; attempt < 100; attempt++) {
                let placeWord = this.attemptToPlaceWord(grid, word);
                if (placeWord) {
                    fails = 0;
                } else {
                    fails++;
                }
                if (fails > 50) {
                    break;
                }
            }

            this.generatedGrids.push(grid);
            this.usedWords = [];
        }
    }

    getGrid() {
        let best = this.generatedGrids[0];
        for(let gr of this.generatedGrids) {
            if(best.getLettersCount() > gr.getLettersCount()) {
                best = gr;
            }
        }
        return best;
    }

    printPuzzleToConsole() {
        const grid = this.getGrid();
        let row = '';
        for (let i = 0; i < grid.size; i++) {
            for (let j = 0; j < grid.size; j++) {
                row += (grid.getLetter(i, j) ?? '*') + ' ';
            }
            console.log(row);
            row = '';
        }
    }

    attemptToPlaceWord(grid, word) {
        let wordText = this.tryAWord();
        for (let i = 0; i < grid.size; i++) {
            for (let j = 0; j < grid.size; j++) {
                word.text = wordText;
                word.row = i;
                word.col = j;
                word.vertical = this.randomOrientation();

                const letter = grid.getLetter(i, j);
                if (word.text && word.text.includes(letter)) {
                    if (word.vertical) {
                        word.row -= word.text.indexOf(letter);
                    } else {
                        word.col -= word.text.indexOf(letter);
                    }

                    if (grid.refresh(word)) {
                        this.pushUsedWords(word.text);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    tryAWord() {
        let word = this.randomWord();
        let goodWord = this.isGoodWord(word);
        let attempts = 0;

        while (this.usedWords.includes(word) || !goodWord) {
            word = this.randomWord();
            goodWord = this.isGoodWord(word);
            if (++attempts > 20) {
                break;
            }
        }

        return word;
    }


    isGoodWord(wordText) {
        let good = false;
        for (let char of this.goodStartingLetters) {
            if (wordText && wordText.includes(char)) {
                good = true;
                break;
            }
        }

        return good;
    }

    pushUsedWords(wordText) {
        this.usedWords.push(wordText);
        wordText.split('').forEach(c => this.goodStartingLetters.add(c));
    }

    getUnusedWords() {
        return this.words.filter(w => !this.usedWords.includes(w));
    }

    getOrientation() {
        if (!this.wordOrientation) {
            return this.randomOrientation();
        }
        return !this.wordOrientation;
    }

    getLongestWord() {
        let longest = '';
        for (let w of this.words) {
            if (w.length > longest.length) {
                longest = w;
            }
        }

        return longest;
    }

    randomOrientation() {
        return this.randomNumber(10) >= 5;
    }

    randomWord() {
        let w = this.getUnusedWords();
        return w[this.randomNumber(w.length)];
    }

    randomNumber(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}