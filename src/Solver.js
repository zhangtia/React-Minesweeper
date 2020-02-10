// TODO: Takes a board and attempts to solve the board. 
// Return a boolean indicating if the board was successfully solved.
function solve(board) {
    //throw Error('Not Implemented');
    /*

    click the corners until blank tiles are found, if still not found, do random clicks

    init a NxN grid and mark all cells that opened with their neighbour value

    scan the grid:

    IF          neighbour_value = 0 and still have unopened neighbors, click on them.
    ELSE IF     neighbour_value = surrounding_unopened, mark those that are unopened as mines.
                    when mines are marked, decrease all surrounding non-mine neighbour_value by 1
    IF      no changes were made (mark mines/opening), do a random click and continue scanning

    */

    brd = board;
    targetopen = Math.pow(brd.n, 2) - brd.numMines;

    // FIRST MOVE : click top left corner. Statistically speaking, corners are the best opening play.
    brd.answ[0][0].opened = true;

    totalopen = 1;
    changes = 1;
    // WHILE changes are made, keep looping
    while (changes) {
        changes = 0;
        //console.log(changes);
        for (idx = 0; idx < brd.n; idx++) {
            for (j = 0; j < brd.n; ++j) {
                if (brd.answ[idx][j].opened) {
                    nhbrs = find_unopn_nhbrs(brd, idx, j);
                    if (brd.answ[idx][j].value === 0 && nhbrs.length > 0) {
                        // all the neighbours are safe to open
                        safeopen(brd, nhbrs);
                        changes += nhbrs.length; // record number of changes made
                        totalopen += nhbrs.length;
                    }
                    else if (nhbrs.length !== 0 && brd.answ[idx][j].value === nhbrs.length) {
                        // all the neighbours are mines
                        foundbomb(brd, nhbrs);
                        changes += nhbrs.length;
                    }
                }
            }
        }
        if (totalopen === targetopen) return true;
        if (changes === 0) {
            bln = randomclick(brd);
            if (bln) changes++;
        }
    }
    //console.log("pls no");
    return false;
}

function find_unopn_nhbrs(board, x, y) {
    unopn = [];
    if (x - 1 >= 0) {
        // check x-1
        if (y - 1 >= 0 && !board.answ[x - 1][y - 1].opened && !board.answ[x - 1][y - 1].flagged) unopn.push({ x: x - 1, y: y - 1 });
        if (y + 1 < board.n && !board.answ[x - 1][y + 1].opened && !board.answ[x - 1][y + 1].flagged) unopn.push({ x: x - 1, y: y + 1 });
        if (!board.answ[x - 1][y].opened && !board.answ[x - 1][y].flagged) unopn.push({ x: x - 1, y: y });
    }
    if (x + 1 < board.n) {
        if (y - 1 >= 0 && !board.answ[x + 1][y - 1].opened && !board.answ[x + 1][y - 1].flagged) unopn.push({ x: x + 1, y: y - 1 });
        if (y + 1 < board.n && !board.answ[x + 1][y + 1].opened && !board.answ[x + 1][y + 1].flagged) unopn.push({ x: x + 1, y: y + 1 });
        if (!board.answ[x + 1][y].opened && !board.answ[x + 1][y].flagged) unopn.push({ x: x + 1, y: y });
    }
    if (y - 1 >= 0 && !board.answ[x][y - 1].opened && !board.answ[x][y - 1].flagged) unopn.push({ x: x, y: y - 1 });
    if (y + 1 < board.n && !board.answ[x][y + 1].opened && !board.answ[x][y + 1].flagged) unopn.push({ x: x, y: y + 1 });

    return unopn;
}

function safeopen(board, arr) {
    for (r = 0; r < arr.length; ++r) {
        board.answ[arr[r].x][arr[r].y].opened = true;
        //if (board.answ[arr[r].x][arr[r].y].isMine) console.log("BOOM");
    }
}

function foundbomb(board, arr) {
    // all coords in arr are bombs. everytime we flag a cell as a bomb, we decrease value of all neighbours by 1.
    for (i = 0; i < arr.length; ++i) {
        x_coord = arr[i].x;
        y_coord = arr[i].y;

        board.answ[x_coord][y_coord].flagged = true;

        if (x_coord - 1 >= 0) {
            if (y_coord - 1 >= 0) board.answ[x_coord - 1][y_coord - 1].value--;
            if (y_coord + 1 < board.n) board.answ[x_coord - 1][y_coord + 1].value--;
            board.answ[x_coord - 1][y_coord].value--;
        }
        if (x_coord + 1 < board.n) {
            if (y_coord - 1 >= 0) board.answ[x_coord + 1][y_coord - 1].value--;
            if (y_coord + 1 < board.n) board.answ[x_coord + 1][y_coord + 1].value--;
            board.answ[x_coord + 1][y_coord].value--;
        }
        if (y_coord - 1 >= 0) board.answ[x_coord][y_coord - 1].value--;
        if (y_coord + 1 < board.n) board.answ[x_coord][y_coord + 1].value--;
    }

}

function randomclick(board) {
    // click on a random unflagged cell
    for (i = 0; i < board.n; ++i) {
        for (j = 0; j < board.n; ++j) {
            if (!board.answ[i][j].opened && !board.answ[i][j].flagged) {
                board.answ[i][j].opened = true;
                //if (board.answ[i][j].isMine) console.log(" # DEEAAADD # ")
                return true;
            }
        }
    }
    return false;
}

// Leave as CommonJs for runSolver
module.exports = solve;
