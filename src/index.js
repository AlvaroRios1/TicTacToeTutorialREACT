import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Functiona Reac Component
// Stateless so they don't need React.Component
// Their state is managed by the Game Component that re-renders their value
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


// Basically squaresController.  It renders the squares based on
// an array of details given by its parent, Game
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }


  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

//The big boy controller
//Manages state of the board and gives it
//the current state in the form of an array 
//of squares
//keeps track of history of states and history of specific move
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
      histCoord: [{
       col: null,
       row: null,
      }]
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const histCoord = this.state.histCoord.slice(0, this.state.stepNumber + 1);
    let row;
    let col;
    //really cruddy way of updating col and row history
    console.log(i);
    switch(i){
      case 0:
        row = 0;
        col = 0;
        break;
      case 1:
        row = 0;
        col = 1;
        break;
      case 2:
        row = 0;
        col = 2;
        break;
      case 3:
        row = 1;
        col = 0;
        break;
      case 4:
        row = 1;
        col = 1;
        break;
      case 5:
        row = 1;
        col = 2;
        break;
      case 6:
        row = 2;
        col = 0;
        break;
      case 7:
        row = 2;
        col = 1;
        break;
      case 8:
        row = 2;
        col = 2;
        break;
      default:
        row = null;
        col = null;
        break;     
    }
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      histCoord: histCoord.concat([{
        col: col,
        row: row,
      }])
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const histCoord = this.state.histCoord;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    const histList = histCoord.map((step, move) => {
      const histMsg = (step.col != null) ?
        'Move :[' + step.col + "][" + step.row + "]" : 
        'Game has started!';
        return(
          <li key={move} class="mb-2 border-bottom">
            {histMsg}
          </li>

        );
    });


    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className="container">
            <div className="row">
              <div className="clearfix visible-xs-block">
                <ol>{moves}</ol>
              </div>
              <div className="clearfix visible-xs-block">
                <ol>{histList}</ol>
              </div>
            </div>
          </div>
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
