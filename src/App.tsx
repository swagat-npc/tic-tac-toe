import { useEffect, useState } from "react";
import "./App.css";
import CellBtn from "./components/CellBtn";
import { CellState, GameState } from "./types/State";
import ActionBtn from "./components/ActionBtn";
import MainHeader from "./components/MainHeader";
import type {
  SearchBestIndexResponse,
  WinConditionResponse,
} from "./types/Response";

const WIN_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6], // diagonals
];

const TOTAL_TURNS = 9;

const App = () => {
  const [turn, setTurn] = useState<number>(0);
  const [cells, setCells] = useState<CellState[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.Ongoing);
  const [winCombo, setWinCombo] = useState<number[]>([]);
  const [singlePlayer, setSinglePlayer] = useState<boolean>(true);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setTurn(0);
    setCells(Array(TOTAL_TURNS).fill(CellState.T));
    setGameState(GameState.Ongoing);
    setWinCombo([]);
  };

  const checkWinConditions = (
    updatedCells: CellState[],
  ): WinConditionResponse => {
    let win = null;
    let winCombo: number[] = [];
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const group = WIN_CONDITIONS[i];
      if (
        updatedCells[group[0]] === updatedCells[group[1]] &&
        updatedCells[group[1]] === updatedCells[group[2]] &&
        updatedCells[group[0]] !== CellState.T
      ) {
        win = updatedCells[group[0]] === CellState.X;
        winCombo = [...group];
        break;
      }
    }
    return { win, winCombo };
  };

  const endGame = (win: boolean | null) => {
    if (win === true) {
      setGameState(GameState.Win);
    } else if (win === false) {
      setGameState(GameState.Lose);
    } else {
      setGameState(GameState.Tie);
    }
  };

  const changeTurn = (index: number) => {
    if (gameState !== GameState.Ongoing) return;

    const updatedCells = [...cells];
    updatedCells[index] = currentTurn(turn);
    setCells(updatedCells);

    if (!processTurn(updatedCells, turn)) return;
    const nextTurn = turn + 1;

    if (currentTurn(nextTurn) === CellState.O && singlePlayer) {
      handleAI(nextTurn, updatedCells);
    }
  };

  const handleAI = (turn: number, cells: CellState[]) => {
    const chosenMove = searchBestIndex(-1, turn, cells);

    const updatedCells = [...cells];
    updatedCells[chosenMove.index] = currentTurn(turn);
    setCells(updatedCells);

    processTurn(updatedCells, turn);
  };

  const processTurn = (updatedCells: CellState[], turn: number): boolean => {
    const winInfo = checkWinConditions(updatedCells);
    const nextTurn = turn + 1;
    if (nextTurn >= TOTAL_TURNS || winInfo.win !== null) {
      endGame(winInfo.win);
      setWinCombo(winInfo.winCombo);
      return false;
    }

    setTurn(nextTurn);
    return true;
  };

  const searchBestIndex = (
    cellIndex: number,
    turn: number,
    newCells: CellState[],
  ): SearchBestIndexResponse => {
    let localIndex = cellIndex;
    let searchInfo: SearchBestIndexResponse = {
      score: -Infinity,
      index: cellIndex,
    };

    const isMaximizer = currentTurn(turn) === CellState.X;
    let localScore = isMaximizer ? -Infinity : Infinity;

    for (let i = 0; i < newCells.length; i++) {
      if (newCells[i] !== CellState.T) continue;

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

      if (score !== 0) {
        return { score, index: i };
      }

      if (TOTAL_TURNS - newTurn > 0) {
        searchInfo = searchBestIndex(i, turn + 1, updatedCells);
      } else {
        return { score: 0, index: i };
      }

      if (
        isMaximizer
          ? searchInfo.score > localScore
          : searchInfo.score < localScore
      ) {
        localScore = searchInfo.score;
        localIndex = i;
      }
    }

    return { score: localScore, index: localIndex };
  };

  const currentTurn = (givenTurn: number): CellState => {
    return givenTurn % 2 === 0 ? CellState.X : CellState.O;
  };

  const modeChange = () => {
    setSinglePlayer(!singlePlayer);
    resetGame();
  }

  return (
    <div className="main-container">
      <section id="header">
        <MainHeader
          currentTurn={currentTurn(turn)}
          gameState={gameState}
          mode={singlePlayer}
          modeAction={modeChange}
        ></MainHeader>
      </section>
      <section id="grid">
        <div className="cell-btn-container">
          {cells.map((cell, index) => {
            return (
              <CellBtn
                key={index}
                placement={index}
                symbol={cell}
                currentTurn={currentTurn(turn)}
                disabled={cell !== CellState.T}
                action={changeTurn}
                customClass={
                  (winCombo.includes(index) ? "winner " : "") +
                  (gameState !== GameState.Ongoing ? "ended" : "")
                }
              />
            );
          })}
        </div>
      </section>
      <section id="actions">
        <ActionBtn label="Reset 🖱✨" action={resetGame} />
      </section>
    </div>
  );
};

export default App;
