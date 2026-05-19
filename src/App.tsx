import { useEffect, useState } from 'react'
import './App.css'
import CellBtn from './components/CellBtn'
import { CellState, GameState } from './types/State';
import ActionBtn from './components/ActionBtn';
import MainHeader from './components/MainHeader';

const WIN_CONDITIONS = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

const App = () => {
  const [turn, setTurn] = useState<number>(1);
  const [cells, setCell] = useState<CellState[]>([]);
  const [gameEnd, setGameEnd] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>(GameState.Ongoing)

  useEffect(() => {
    resetGame();
  }, []);
  
  const resetGame = () => {
    resetCells();
    resetTurn();
    setGameEnd(false);
    setGameState(GameState.Ongoing);
  }

  const resetCells = () => {
    setCell([
      CellState.T, CellState.T, CellState.T,
      CellState.T, CellState.T, CellState.T,
      CellState.T, CellState.T, CellState.T,
    ]);
  }

  const endGame = (updatedCells: CellState[]) => {
    // Check winning conditions
    let win = null;
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const group = WIN_CONDITIONS[i];
      if (updatedCells[group[0]] == updatedCells[group[1]] && updatedCells[group[1]] == updatedCells[group[2]]) {
        win = updatedCells[group[0]] == CellState.X;
        break;
      }      
    }
    if (win === true) {
      setGameState(GameState.Win);
    } else if (win === false) {
      setGameState(GameState.Lose);
    } else {
      setGameState(GameState.Tie);
    }
    
    setGameEnd(true);
  }

  const resetTurn = () => {
    setTurn(1);
  }

  const changeTurn = (index: number) => {
    if (gameEnd) return;


    const updatedCells = [...cells];
    updatedCells[index] = currentTurn();
    setCell(updatedCells);

    const nextTurn = turn + 1;
    setTurn(nextTurn);
    
    if (nextTurn > 9) {
      endGame(updatedCells);
    }
  }

  const currentTurn = (): CellState => {
    return (turn % 2 == 0 ? CellState.O : CellState.X);
  }

  return (
    <div className="main-container">
      <section id="header">
        <MainHeader currentTurn={currentTurn()} gameState={gameState}></MainHeader>
      </section>
      <section id="grid">
        <div className="cell-btn-container">
          {
            cells.map((cell, index) => {
              return <CellBtn key={index} placement={index} symbol={cell} currentTurn={currentTurn()} disabled={cell != CellState.T} action={changeTurn} />
            })
          }
        </div>
      </section>
      <section id="actions">
          <ActionBtn label="Reset" action={resetGame}/>
      </section>
    </div>
  )
}

export default App;
