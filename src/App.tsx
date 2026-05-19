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

const TOTAL_TURNS = 10;

const App = () => {
  const [turn, setTurn] = useState<number>(1);
  const [cells, setCells] = useState<CellState[]>([]);
  const [gameEnd, setGameEnd] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>(GameState.Ongoing);
  const [winCombo, setWinCombo] = useState<number[]>([]);

  useEffect(() => {
    resetGame();
  }, []);
  
  const resetGame = () => {
    resetTurn();
    resetCells();
    setGameEnd(false);
    setGameState(GameState.Ongoing);
    setWinCombo([]);
  }

  const resetCells = () => {
    setCells([
      CellState.T, CellState.T, CellState.T,
      CellState.T, CellState.T, CellState.T,
      CellState.T, CellState.T, CellState.T,
    ]);
  }

  type WinConditionResponse = {
    win: boolean | null,
    winCombo: number[]
  }

  const checkWinConditions = (updatedCells: CellState[]): WinConditionResponse => {
    let win = null;
    let winCombo: number[] = [];
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const group = WIN_CONDITIONS[i];
      if (updatedCells[group[0]] == updatedCells[group[1]] && updatedCells[group[1]] == updatedCells[group[2]] && updatedCells[group[0]] != CellState.T) {
        win = updatedCells[group[0]] == CellState.X;
        winCombo = [...group];
        break;
      }      
    }
    return { win, winCombo };
  }
  const endGame = (win: boolean | null) => {
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
    updatedCells[index] = currentTurn(turn);
    setCells(updatedCells);

    const winInfo = checkWinConditions(updatedCells);
    
    const nextTurn = turn + 1;
    if (nextTurn > 9 || winInfo.win != null) {
      endGame(winInfo.win);
      setWinCombo(winInfo.winCombo);
      return;
    }
    
    setTurn(nextTurn);
    if (currentTurn(nextTurn) == CellState.O) {
      handleAI(nextTurn, updatedCells);
    }
  }

  const handleAI = (turn: number, cells: CellState[]) => {
    const chosenMove = searchBestIndex(-1, turn, cells);

    const updatedCells = [...cells];
    updatedCells[chosenMove.index] = currentTurn(turn);
    setCells(updatedCells);

    const winInfo = checkWinConditions(updatedCells);
    const nextTurn = turn + 1;
    if (nextTurn > 9 || winInfo.win != null) {
      endGame(winInfo.win);
      setWinCombo(winInfo.winCombo);
      return;
    }

    setTurn(nextTurn);
  }

  type SearchBestIndexOutput = {
    score: number,
    index: number
  }

  const searchBestIndex = (cellIndex: number, turn: number, newCells: CellState[]): SearchBestIndexOutput => {
    let emptySpaces = newCells.includes(CellState.T);
    let localIndex = cellIndex;
    let searchInfo: SearchBestIndexOutput = { score: -Infinity, index: cellIndex };
    
    const isMaximizer = currentTurn(turn) == CellState.X;
    let localScore = isMaximizer ? -Infinity : Infinity;
    
    // If no empty cells, return a neutral score and the given cellIndex
    if (emptySpaces) {
      for (let i = 0; i < newCells.length; i++) {
        // Skip if not an empty cell
        if (newCells[i] != CellState.T) continue;
        
        // Create a temporary storage to be used inside the recursive loop
        // Update current position with current turn
        const updatedCells = [...newCells];
        updatedCells[i] = currentTurn(turn);
        const newTurn = turn + 1;
  
        const winInfo = checkWinConditions(updatedCells);
        let score = 0;
        if (winInfo.win === true) {
          score = 1;
        } else if (winInfo.win === false) {
          score = -1;
        }

        // If current turn is winning or losing case, return immediately
        if (score != 0) {
          return { score, index: i };
        }
        
        // Check if there are still empty spaces
        // TODO: This might be redundant as empty spaces is already calculated in the beginning. Check.
        if (TOTAL_TURNS - newTurn >= 0) {
          searchInfo = searchBestIndex(i, turn + 1, updatedCells);
        } else {
          // No more turns, Draw
          return { score: 0, index: i };
        }
        
        if (currentTurn(turn) == CellState.X) {
            // Player
            // Max the minimum value
            // X wants the perfect score
            // MAXIMIZER
            // This is Our Turn. We wants X to win
            // A number less than Infinity, are all 3 scores conditions
            // which are Win +1, Lose -1 and Draw 0
            // so if searchInfo has not yet been set by a `searchBestIndex` method call
            // the provided score will always be returned
            const localMax = Math.max(localScore, searchInfo.score);
            
            if (localMax == searchInfo.score) {
              localScore = searchInfo.score;
              localIndex = i;
            }
        } else if (currentTurn(turn) == CellState.O) {
            // Bot
            // Min the maximum value
            // O wants the perfect score
            // MINIMIZER
            // This is Bot's Turn. It wants O to win
            // A number greater than -Infinity, are all 3 scores conditions
            // which are Win +1, Lose -1 and Draw 0
            // so if searchInfo has not yet been set by a `searchBestIndex` method call
            // the provided score will always be returned
            const localMin = Math.min(localScore, searchInfo.score);

            if (localMin == searchInfo.score) {
              localScore = searchInfo.score;
              localIndex = i;
            }
        }
      }
    } else {
      return { score: 0, index: cellIndex };
    }

    return { score: localScore, index: localIndex };
  }

  const currentTurn = (givenTurn: number): CellState => {
    return (givenTurn % 2 == 0 ? CellState.O : CellState.X);
  }

  return (
    <div className="main-container">
      <section id="header">
        <MainHeader currentTurn={currentTurn(turn)} gameState={gameState}></MainHeader>
      </section>
      <section id="grid">
        <div className="cell-btn-container">
          {
            cells.map((cell, index) => {
              return <CellBtn key={index} placement={index} symbol={cell} currentTurn={currentTurn(turn)} disabled={cell != CellState.T} action={changeTurn} customClass={(winCombo.includes(index) ? "winner " : "") + (gameEnd ? "ended" : "")} />
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
