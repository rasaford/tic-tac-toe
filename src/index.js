import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  const background = props.winner ? { backgroundColor: "green" } : {};
  return (
    <button className="square" onClick={props.onClick} style={background}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, winner) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winner={winner}
        key={i}
      />
    );
  }

  render() {
    let rows = [];
    let count = 0;
    let winning = 0;
    for (let i = 0; i < 3; i++) {
      let cols = [];
      for (let j = 0; j < 3; j++) {
        let winner = false;
        if (this.props.winner && this.props.winner[winning] === count) {
          winner = true;
          winning++;
        }
        cols.push(this.renderSquare(count++, winner));
      }
      rows.push(
        <div className="board-row" key={i}>
          {cols}
        </div>
      );
    }
    return rows;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          move: -1
        }
      ],
      xIsNext: true,
      stepNumber: 0
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const top = history[history.length - 1];
    const squares = top.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          move: i
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }
  render() {
    const history = this.state.history;
    const top = history[this.state.stepNumber];
    const winner = calculateWinner(top.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to move start";
      const dir =
        step.move === -1
          ? ""
          : "x: " +
            (step.move % 3 + 1) +
            ", y: " +
            (Math.floor(step.move / 3) + 1);
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {this.state.stepNumber === move ? <strong>{desc}</strong> : desc}
          </button>
          <small>{dir}</small>
        </li>
      );
    });
    let status;
    if (winner) {
      status = "Winner: " + top.squares[winner[0]];
    } else if (this.state.stepNumber === 9) {
      status = "Draw, no one has won the game";
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={top.squares}
            onClick={i => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
