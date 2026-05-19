import { useEffect, useState } from 'react'
import './App.css'
import CellBtn from './components/CellBtn'
import { CellState, GameState } from './types/State';
import ActionBtn from './components/ActionBtn';
import MainHeader from './components/MainHeader';

const App = () => {
  const [turn, setTurn] = useState<number>(1);
  const [cells, setCell] = useState<CellState[]>([]);
  const [gameEnd, setGameEnd] = useState<boolean>(false);

  useEffect(() => {
    resetGame();
  }, []);
  
  const resetGame = () => {
    resetCells();
    resetTurn();
    setGameEnd(false);
  }

  const resetCells = () => {
    setCell([
      CellState.T, CellState.T, CellState.T,
      CellState.T, CellState.T, CellState.T,
      CellState.T, CellState.T, CellState.T,
    ]);
  }

  const resetTurn = () => {
    setTurn(1);
  }

  const changeTurn = (index: number) => {
    if (gameEnd) return;

    setCell(prev => {
      const updatedCells = [...prev];
      updatedCells[index] = currentTurn();
      return updatedCells;
    });

    const nextTurn = turn + 1;
    setTurn(nextTurn);
    
    if (nextTurn > 9) {
      setGameEnd(true);
    }
  }

  const currentTurn = (): CellState => {
    return (turn % 2 == 0 ? CellState.O : CellState.X);
  }

  const gameState = (): GameState => {
    if (!gameEnd) return GameState.Ongoing;

    return GameState.Win;
  }

  return (
    <div className="main-container">
      <section id="header">
        <MainHeader currentTurn={currentTurn()} gameState={gameState()}></MainHeader>
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
