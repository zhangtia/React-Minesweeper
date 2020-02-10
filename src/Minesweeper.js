import React from 'react';
import Board from './Board';

class Minesweeper extends React.PureComponent {
    constructor(props) {
        super(props)
        const n = 10;
        const numMines = 10;
        this.state = {
            n,
            numMines,
            board: new Board(n, numMines),
            icons: {
                blank: 'http://i.imgur.com/HM1e3Tbb.jpg',
                pressed: 'http://i.imgur.com/bGT8xGEb.jpg',
                exposedBomb: 'http://i.imgur.com/pTJ8Swhb.jpg',
                explodedBomb: 'http://i.imgur.com/UFmXprFb.jpg',
                flag: 'http://i.imgur.com/nLPvW15b.jpg',
                // Index is # of adjacent bombs
                bombs: [
                    'http://i.imgur.com/Flqdqi1b.jpg', // 0
                    'http://i.imgur.com/bM8oExob.jpg', // 1
                    'http://i.imgur.com/bQKSbqYb.jpg', // 2
                    'http://i.imgur.com/5jNcEeVb.jpg', // 3
                    'http://i.imgur.com/BnxjHgHb.jpg', // 4
                    'http://i.imgur.com/RaFrMYcb.jpg', // 5
                    'http://i.imgur.com/GlwQOy0b.jpg', // 6
                    'http://i.imgur.com/8ngsVa8b.jpg', // 7
                    'http://i.imgur.com/lJ8P1wab.jpg'  // 8
                ]
            },
            live: true,
            correctOpen: 0,
        };
    }

    showcells() {
        let newboard = this.state.board;
        for (let i = 0; i < this.state.n; ++i) {
            for (let j = 0; j < this.state.n; ++j) {
                newboard.answ[i][j].opened = true;
            }
        }
        this.setState({ board: newboard });
    }

    renderPic(x, y) {
        // if not opened, return blank
        let contents = this.state.board.answ[x][y];
        if (!contents.opened) {
            if (contents.flagged) return (<img style={{ width: 40, height: 40 }} src={this.state.icons.flag} alt="Flagged" />);
            else return (<img style={{ width: 40, height: 40 }} src={this.state.icons.blank} alt="Blank" />);
        }
        else {
            // cell is opened
            if (contents.isMine && contents.exploded) return (<img style={{ width: 40, height: 40 }} src={this.state.icons.explodedBomb} alt="ExplodedBomb" />);
            else if (contents.isMine && !contents.exploded) return (<img style={{ width: 40, height: 40 }} src={this.state.icons.exposedBomb} alt="ExposedBomb" />);
            else return (<img style={{ width: 40, height: 40 }} src={this.state.icons.bombs[contents.value]} alt="AdjBombs" />);
        }
    }

    handleRclick(e, x, y) {
        e.preventDefault();
        let newboard = this.state.board;
        if (newboard.answ[x][y].opened) return;

        newboard.answ[x][y].flagged = !newboard.answ[x][y].flagged;

        this.setState({ board: newboard });
        this.forceUpdate();
    }

    handleLclick(x, y) {
        if (this.state.board.answ[x][y].opened || this.state.board.answ[x][y].flagged) return;
        let currentopen = this.state.correctOpen;
        let newboard = this.state.board;
        if (!newboard.answ[x][y].isMine) currentopen++;
        //alert("FIRST " + currentopen);
        newboard.answ[x][y].opened = true;
        // if blank tile is clicked, reveal all neighbours
        if (!newboard.answ[x][y].isMine && newboard.answ[x][y].value === 0) {
            // keep_checking to keep track of neighbouring blank cells to open
            let keep_checking = [];
            if (x + 1 < this.state.n) {
                // x+1 possible
                if (y + 1 < this.state.n && !newboard.answ[x + 1][y + 1].opened) {
                    keep_checking.push({ x: x + 1, y: y + 1 });
                }
                if (y - 1 > -1 && !newboard.answ[x + 1][y - 1].opened) {
                    keep_checking.push({ x: x + 1, y: y - 1 });
                }
                if (!newboard.answ[x + 1][y].opened) {
                    keep_checking.push({ x: x + 1, y: y });
                }
            }
            if (x - 1 > -1) {
                // x-1 possible
                if (y + 1 < this.state.n && !newboard.answ[x - 1][y + 1].opened) {
                    keep_checking.push({ x: x - 1, y: y + 1 });
                }
                if (y - 1 > -1 && !newboard.answ[x - 1][y - 1].opened) {
                    keep_checking.push({ x: x - 1, y: y - 1 });
                }
                if (!newboard.answ[x - 1][y].opened) {
                    keep_checking.push({ x: x - 1, y: y });
                }
            }
            if (y + 1 < this.state.n && !newboard.answ[x][y + 1].opened) {
                keep_checking.push({ x: x, y: y + 1 });
            }
            if (y - 1 > -1 && !newboard.answ[x][y - 1].opened) {
                keep_checking.push({ x: x, y: y - 1 });
            }

            // while we still need to keep checking,
            while (keep_checking.length > 0) {
                let tocheck = keep_checking.pop();
                if (!newboard.answ[tocheck.x][tocheck.y].opened && !newboard.answ[tocheck.x][tocheck.y].isMine) currentopen++;
                newboard.answ[tocheck.x][tocheck.y].opened = true;
                if (newboard.answ[tocheck.x][tocheck.y].value === 0) {
                    if (tocheck.x + 1 < this.state.n) {
                        // x+1 possible
                        if (tocheck.y + 1 < this.state.n && !newboard.answ[tocheck.x + 1][tocheck.y + 1].opened) keep_checking.push({ x: tocheck.x + 1, y: tocheck.y + 1 });
                        if (tocheck.y - 1 > -1 && !newboard.answ[tocheck.x + 1][tocheck.y - 1].opened) keep_checking.push({ x: tocheck.x + 1, y: tocheck.y - 1 });
                        if (!newboard.answ[tocheck.x + 1][tocheck.y].opened) keep_checking.push({ x: tocheck.x + 1, y: tocheck.y });
                    }
                    if (tocheck.x - 1 > -1) {
                        // x-1 possible
                        if (tocheck.y + 1 < this.state.n && !newboard.answ[tocheck.x - 1][tocheck.y + 1].opened) keep_checking.push({ x: tocheck.x - 1, y: tocheck.y + 1 });
                        if (tocheck.y - 1 > -1 && !newboard.answ[tocheck.x - 1][tocheck.y - 1].opened) keep_checking.push({ x: tocheck.x - 1, y: tocheck.y - 1 });
                        if (!newboard.answ[tocheck.x - 1][tocheck.y].opened) keep_checking.push({ x: tocheck.x - 1, y: tocheck.y });
                    }
                    if (tocheck.y + 1 < this.state.n && !newboard.answ[tocheck.x][tocheck.y + 1].opened) keep_checking.push({ x: tocheck.x, y: tocheck.y + 1 });
                    if (tocheck.y - 1 > -1 && !newboard.answ[tocheck.x][tocheck.y - 1].opened) keep_checking.push({ x: tocheck.x, y: tocheck.y - 1 });

                }
            }
        }
        if (currentopen === Math.pow(this.state.n, 2) - this.state.numMines) {
            this.showcells();
            alert("YOU WIN");
        }
        if (newboard.answ[x][y].isMine) {
            newboard.answ[x][y].opened = true;
            newboard.answ[x][y].exploded = true;
            this.showcells();
            alert("YOU LOSE");
        }
        this.setState({ board: newboard, correctOpen: currentopen });
        this.forceUpdate();

    }




    render() {
        return (
            <div>
                <div style={{ width: 300, height: 100, margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 24, backgroundColor: "#add8e6" }}>
                    <p>Minesweeper</p>
                </div>
                <div style={{ width: 200, margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <p>Refresh page to reset!</p>
                </div>
                <div style={{ width: 500, margin: "0 auto", paddingTop: "2%" }}>
                    {this.state.board.answ.map((row) => {
                        return row.map((contents) => {
                            return (
                                <span key={(contents.x * contents.len) + contents.y}>
                                    <button onContextMenu={(event) => this.handleRclick(event, contents.x, contents.y)} onClick={() => this.handleLclick(contents.x, contents.y)} style={{ width: 50, height: 50, padding: 0, backgroundColor: (contents.opened ? "navy" : "yellow") }}>{this.renderPic(contents.x, contents.y)}</button>
                                    {(contents.len === contents.y + 1) ? <div></div> : ""}
                                </span>
                            );
                        })
                    })}
                </div>
            </div>
        );
    }
}

export default Minesweeper;
