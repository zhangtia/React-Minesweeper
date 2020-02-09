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
            live: true
        };
    }

    renderPic(contents) {
        // if not opened, return blank
        if (!contents.opened) {
            if (!this.state.live && contents.isMine) return (<img style={{ width: 40, height: 40 }} src={this.state.icons.exposedBomb} alt="ExposedBomb" />);
            else return (<img style={{ width: 40, height: 40 }} src={this.state.icons.blank} alt="Blank" />);
        }
        else {
            // cell is opened
            if (contents.flagged) return (<img style={{ width: 40, height: 40 }} src={this.state.icons.flag} alt="Flagged" />);
            else if (contents.isMine) return (<img style={{ width: 40, height: 40 }} src={this.state.icons.explodedBomb} alt="ExplodedBomb" />);
            else return (<img style={{ width: 40, height: 40 }} src={this.state.icons.bombs[contents.value]} alt="AdjBombs" />);
        }
    }

    handleRclick(e) {
        e.preventDefault();
        alert("RIGHT");
    }

    handleLclick() {
        alert("LEFT");
    }



    render() {
        return (
            <div style={{ width: "100%", margin: 0 }}>
                {this.state.board.answ.map((row) => {
                    return row.map((contents) => {
                        return (
                            <span key={(contents.x * contents.len) + contents.y}>
                                <button onContextMenu={(event) => this.handleRclick(event)} onClick={() => this.handleLclick()} style={{ width: 50, height: 50 }}>{this.renderPic(contents)}</button>
                                {(contents.len === contents.y + 1) ? <div></div> : ""}
                            </span>
                        );
                    })
                })}
            </div>
        );
    }
}

export default Minesweeper;
