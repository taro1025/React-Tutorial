import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//スクエアはcontrolled,ボードがcontroll
//classコンポーネントはrenderしかなくてstateを持たない時関数コンポーネントに置き換えられる
function Square(props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
    >
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
      history: [Array(9).fill(null)],
      head: 0
    };
  }
  handleUndo() {
    this.setState({
      squares: this.state.history[this.state.head - 1],
      head: this.state.head - 1
    });
  }
  handleClick(i) {
    //9つのマス丸ごとアップデート
    const squares = this.state.squares.slice(); //コピーしてる
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    //コピーのメリットは
    //①元のデータをそのままにできるのでundo, redoを実装できる
    //②変化を捉えやすい
    //③再描画しやすい
    //undoのやり方
    //squareのstateをセットする
    let history = this.state.history
    history.push(squares)
    //undoされたら一個後ろのstateをセットする
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      history: history, head: this.state.head + 1
    });
  }

  renderSquare(i) {
    return <Square
      value={this.state.squares[i]}
      onClick={() => this.handleClick(i)}
    />;
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner:' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
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
        <button onClick={() => this.handleUndo()}>undo</button>
      </div>

    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  handleUndo() {
    this.setState({ history: this.history[this.state.head - 1] })
  }


  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">

          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
