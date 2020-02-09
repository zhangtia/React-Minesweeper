class Board {
    constructor(n, numMines) {
        this.n = n;
        this.numMines = numMines;
        // TODO: Generate a random board
        // throw Error('Not Implemented');
        if (this.numMines >= this.n * this.n) {
            throw Error('Too many mines!');
        }
        this.answ = this.createBoard(this.n, this.numMines);

    }

    createBoard(n, numMines) {
        let grid = [];

        for (let x_c = 0; x_c < n; ++x_c) {
            grid.push([]);
            for (let y_c = 0; y_c < n; ++y_c) {
                // init each grid cell with x,y coords
                grid[x_c][y_c] = {
                    len: n,
                    x: x_c,
                    y: y_c,
                    isMine: false,
                    value: 0,
                    flagged: false,
                    opened: false
                };
            }
        }

        // randomly add number of mines to unmarked cells
        let mines_to_plant = numMines;
        while (mines_to_plant > 0) {
            let rand_x = Math.floor(Math.random() * n);
            let rand_y = Math.floor(Math.random() * n);
            if (!grid[rand_x][rand_y].isMine) {
                grid[rand_x][rand_y].isMine = true;
                mines_to_plant--;
            }
        }

        // assign a value to each cell
        for (let x_idx = 0; x_idx < n; ++x_idx) {
            for (let y_idx = 0; y_idx < n; ++y_idx) {

                if (!grid[x_idx][y_idx].isMine) {
                    if (x_idx > 1) {
                        // check x-1 values
                        if (y_idx-1 > 0 && grid[x_idx-1][y_idx-1].isMine) {
                            grid[x_idx][y_idx].value += 1;
                        }
                        if (y_idx+1 < n && grid[x_idx-1][y_idx+1].isMine) {
                            grid[x_idx][y_idx].value += 1;
                        }
                        if (grid[x_idx-1][y_idx].isMine) {
                            grid[x_idx][y_idx].value += 1;
                        }
                    }

                    if (x_idx < n-1) {
                        // check x+1 values
                        if (y_idx-1 > 0 && grid[x_idx+1][y_idx-1].isMine) {
                            grid[x_idx][y_idx].value += 1;
                        }
                        if (y_idx+1 < n && grid[x_idx+1][y_idx+1].isMine) {
                            grid[x_idx][y_idx].value += 1;
                        }
                        if (grid[x_idx+1][y_idx].isMine) {
                            grid[x_idx][y_idx].value += 1;
                        }
                    }

                    // check same x values
                    if (y_idx-1 > 0 && grid[x_idx][y_idx-1].isMine) {
                        grid[x_idx][y_idx].value += 1;
                    }
                    if (y_idx+1 < n && grid[x_idx][y_idx+1].isMine) {
                        grid[x_idx][y_idx].value += 1;
                    }
                }
            }
        }

        return grid;
    }

    // TODO: Write interface
};  

// Leave as CommonJS for runSolver
module.exports =  Board;
