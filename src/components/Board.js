import Pgn from '../Pgn.js';
import Pieces from '../global/Pieces.js';
import React from 'react';
import Square from './Square.js';
import Symbol from '../global/Symbol.js';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      move: null,
      pieces: Pieces
    };
  }

  switchColor(color) {
    if (color === Symbol.BLACK) {
      return Symbol.WHITE;
    } else {
      return Symbol.BLACK;
    }
  }

  movePiece(square) {
    let piece = this.state.pieces[square];
    let newState = this.state;

    switch (true) {
      // leave piece on empty square
      case this.state.move !== null && piece === undefined:
        delete newState.pieces[this.state.move.from];
        newState.move.to = square;
        newState.pieces[this.state.move.to] = this.state.move.piece;
        newState.history.push({
          color: this.state.move.piece.color,
          pgn: Pgn.convert(this.state.move)
        });
        this.setState(newState);
        newState = this.state;
        newState.move = null;
        this.setState(newState);
        break;

      // pick piece on non-empty square
      case this.state.move === null && piece !== undefined:
        newState.move = {
          piece: piece,
          from: square
        };
        this.setState(newState);
        break;

      // leave piece on non-empty square
      case this.state.move !== null && piece !== undefined:
        delete newState.pieces[this.state.move.from];
        newState.move.to = square;
        newState.pieces[this.state.move.to] = this.state.move.piece;
        newState.history.push({
          color: this.state.move.piece.color,
          pgn: Pgn.convert(this.state.move, 'x')
        });
        this.setState(newState);
        newState = this.state;
        newState.move = null;
        this.setState(newState);
        break;

      // pick piece on empty square
      default:
        // do nothing
        break;
    }

    console.log(this.state);
  }

  renderRow(number) {
    let ascii = 96;
    let color;
    let row = [];

    if (number % 2 !== 0) {
      color = Symbol.BLACK;
    } else {
      color = Symbol.WHITE;
    }

    for (let i=1; i<=8; i++) {
      ascii++;
      let square = String.fromCharCode(ascii) + number;
      row.push(<Square
        key={i}
        square={square}
        color={color}
        state={this.state}
        onClick={() => this.movePiece(square)} />
      );
      color = this.switchColor(color);
    }

    return row;
  }

  renderHistory() {
    let history = [];
    this.state.history.forEach(function (item, index) {
      history.push(<li key={index}>{item.pgn}</li>);
    });

    return (
      <ul>{history}</ul>
    );
  }

  renderBoard() {
    let board = [];
    for (let i=8; i>=1; i--) {
      board.push(<div
        key={i}
        className="pgn-board-row">
          {this.renderRow(i)}
      </div>
      );
    }

    return board;
  }

  render() {
    return (
      <div className="pgn-board">
        {this.renderBoard()}
        {this.renderHistory()}
      </div>
    );
  }
}