import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import buttonImage from './images/button.png';

/* To start react: npm start*/

function App() {
    const boards = [
        [
            [7, 8, 0, 4, 0, 0, 1, 2, 0],
            [6, 1, 0, 0, 7, 5, 0, 0, 9],
            [0, 0, 0, 6, 0, 1, 0, 7, 8],
            [0, 0, 7, 0, 4, 0, 2, 6, 0],
            [0, 0, 1, 0, 5, 0, 9, 3, 0],
            [9, 0, 4, 0, 6, 0, 0, 0, 5],
            [0, 7, 0, 3, 0, 0, 0, 1, 2],
            [1, 2, 0, 0, 0, 7, 4, 0, 0],
            [0, 4, 9, 2, 0, 6, 0, 0, 7]
        ],
        [
        [5, 2, 0, 8, 3, 1, 0, 6, 4],
            [8, 0, 4, 0, 0, 0, 0, 5, 3],
            [1, 0, 3, 0, 4, 0, 0, 0, 0],
            [6, 5, 0, 0, 0, 8, 0, 0, 0],
            [0, 4, 9, 7, 0, 3, 5, 1, 0],
            [0, 0, 8, 4, 1, 5, 2, 9, 0],
            [0, 0, 0, 1, 0, 7, 6, 0, 0],
            [4, 0, 0, 0, 0, 6, 8, 0, 0],
            [9, 1, 0, 0, 0, 0, 0, 7, 0]
        ],
        [
            [6, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 5, 0, 0, 0, 8, 6, 0, 0],
            [9, 8, 4, 0, 7, 6, 0, 0, 3],
            [0, 9, 0, 4, 0, 0, 0, 3, 0],
            [7, 0, 0, 0, 9, 3, 0, 8, 0],
            [8, 0, 2, 0, 0, 1, 0, 6, 0],
            [0, 7, 8, 5, 0, 0, 9, 2, 6],
            [0, 0, 0, 0, 0, 7, 1, 5, 0],
            [5, 0, 0, 8, 2, 9, 3, 4, 7]
        ]
    ];

const currentBoardRef = useRef([]);

    // Function to compare two boards
    const areBoardsEqual = (board1, board2) => {
        if (board1.length !== board2.length) return false;
        for (let i = 0; i < board1.length; i++) {
            if (board1[i].length !== board2[i].length) return false;
            for (let j = 0; j < board1[i].length; j++) {
                if (board1[i][j] !== board2[i][j]) return false;
            }
        }
        return true;
    };
    const getRandomBoard = () => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * boards.length);
        } while (areBoardsEqual(boards[randomIndex],currentBoardRef.current));
        currentBoardRef.current = boards[randomIndex];
        return boards[randomIndex];
    };

    const [board, setBoard] = useState(() => {
        const initialBoard = getRandomBoard();
        currentBoardRef.current = initialBoard;
        return initialBoard;
    });

    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleChange = (row, col, value) => {
        const newBoard = board.map((r, rIdx) => rIdx === row ? r.map((c, cIdx) => cIdx === col ? parseInt(value) || 0 : c) : r);
        setBoard(newBoard);

    };

    const getNewBoard = () => {
        const newBoard = getRandomBoard();
        setBoard(newBoard);
    };

    const reset = () => {
        setBoard(currentBoardRef.current.map(row => [...row]));
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
        if (data.steps) {
            setSteps(data.steps);
            setCurrentStep(0);
        } else {
            alert('Board cannot be solved');
        }
    };

    useEffect(() => {
        if (steps.length > 0) {
            const interval = setInterval(() => {
                setCurrentStep((prevStep) => {
                    if (prevStep < steps.length - 1) {
                        return prevStep + 1;
                    } else {
                        clearInterval(interval);
                        return prevStep;
                    }
                });
            }, 100); // Change this value to control the speed of the steps
            return () => clearInterval(interval);
        }
    }, [steps]);

    return (
        <div className="App">
            <div className="boards-container">
                <div>
                    <div className="board1">
                        <h2>Sudoku Board</h2>
                        {board.map((row, rowIndex) => (
                            <div key={rowIndex} className="row">
                                {row.map((cell, colIndex) => (
                                    <input
                                        key={colIndex}
                                        type="number"
                                        value={cell || ''}
                                        onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                                        className={`cell ${currentBoardRef.current[rowIndex][colIndex] == 0 ? 'edited' : ''}`}
                                        readOnly={currentBoardRef.current[rowIndex][colIndex] !== 0}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {steps.length > 0 && (
                    <div>
                        <div className="board2">
                            <h2>Solved Board (Step by Step)</h2>
                            {steps[currentStep].map((row, rowIndex) => (
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
            <button onClick={handleSubmit} className="my-button">
                Solve
            </button>

            <button onClick={reset} className="my-button">
                Reset
            </button>

            <button onClick={getNewBoard} className="my-button">
                New Board
            </button>

            {loading && <p>Loading...</p>}
        </div>
    );
}

export default App;
