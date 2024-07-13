import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [board, setBoard] = useState([
    [0, 0, 4, 0, 0, 0, 0, 8, 6],
    [0, 0, 0, 0, 7, 0, 0, 0, 0],
    [0, 8, 0, 0, 3, 6, 0, 0, 1],
    [0, 6, 0, 7, 0, 0, 0, 0, 0],
    [0, 0, 0, 4, 0, 0, 0, 0, 5],
    [0, 0, 9, 0, 6, 5, 3, 0, 0],
    [0, 4, 0, 0, 8, 1, 0, 0, 3],
    [0, 0, 0, 5, 0, 0, 0, 0, 0],
    [2, 0, 0, 0, 0, 0, 9, 0, 0]
  ]);
  const [solvedBoard, setSolvedBoard] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (row, col, value) => {
    const newBoard = [...board];
    newBoard[row][col] = parseInt(value) || 0;
    setBoard(newBoard);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const response = await fetch('/solve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ board })
    });
    const data = await response.json();
    setLoading(false);
    if (data.solved_board) {
      setSolvedBoard(data.solved_board);
    } else {
      alert('Board cannot be solved');
    }
  };

  return (
    <div>
      <h1>Sudoku Solver</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="number"
                value={cell || ''}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                className="cell"
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Solve</button>
      {loading && <p>Loading...</p>}
      {solvedBoard && (
        <div>
          <h2>Solved Board</h2>
          <div className="board">
            {solvedBoard.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <div key={colIndex} className="cell solved-cell">
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
