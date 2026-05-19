import { useEffect, useState } from 'react'
import './App.css'
import CellBtn from './components/CellBtn'
import { CellState } from './types/CellState';

const App = () => {
  const [turn, setTurn] = useState(CellState.X);
  const [cells, setCell] = useState<CellState[]>([]);

  useEffect(() => {
    resetCells();
    resetTurn();
  }, []);

  const resetCells = () => {
    setCell([
      CellState.T, CellState.T, CellState.T,
      CellState.T, CellState.T, CellState.T,
      CellState.T, CellState.T, CellState.T,
    ]);
  }

  const resetTurn = () => {
    setTurn(CellState.X);
  }

  return (
    <>
      <section id="grid">
        <div className="cell-btn-container">
          {
            cells.map((cell, index) => {
              return <CellBtn key={index} symbol={cell} turn={turn} />
            })
          }
        </div>
      </section>
    </>
  )
}

export default App;
