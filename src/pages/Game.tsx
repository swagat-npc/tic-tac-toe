import { useEffect, useState } from "react";
import CellBtn from "../components/CellBtn";
import ActionBtn from "../components/ActionBtn";
import MainHeader from "../components/MainHeader";
import { CellState, GameState } from "../types/State";
import type {
  SearchBestIndexResponse,
  WinConditionResponse,
} from "../types/Response";
import "./Game.css";
import type { GameProps } from "../types/Prop";
import usePusher from "../hooks/usePusher";

const WIN_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6], // diagonals
];

const TOTAL_TURNS = 9;

const Game = ({ onOpenLobby, online, onLeaveOnline, playerName, roomId, isCreator }: GameProps) => {
  const [turn, setTurn] = useState<number>(0);
  const [cells, setCells] = useState<CellState[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.Ongoing);
  const [winCombo, setWinCombo] = useState<number[]>([]);
  const [isBotPlaying, setBotIsPlaying] = useState<boolean>(true);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const { status: pusherStatus, lastOpponentMove, opponentName, prevOpponentName, memberJoined, creatorLeft, sendMove, sendReset, sendSync, lastSync, lastReset } = usePusher(roomId, playerName, isCreator, online);

  const player1Name = isOnline ? (isCreator ? playerName : opponentName || "Opponent") : "Player 1";
  const player2Name = isOnline ? (isCreator ? opponentName || "Opponent" : playerName) : "Player 2";

  const isMyTurn = isCreator ? turn % 2 === 0 : turn % 2 === 1;

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    resetGame();
    setBotIsPlaying(false);
    setIsOnline(online);
  }, [online]);

  useEffect(() => {
    if (lastOpponentMove === null) return;
    applyMove(lastOpponentMove);
  }, [lastOpponentMove]);

  useEffect(() => {
    if (lastReset === 0) return;
    resetGame();
  }, [lastReset]);

  // Creator left — non-creator exits the game
  useEffect(() => {
    if (!creatorLeft) return;
    onLeaveOnline();
  }, [creatorLeft]);

  // Someone joined — only creator handles this
  useEffect(() => {
    if (!memberJoined || !isCreator) return;
    if (memberJoined.name === prevOpponentName) {
      // Same player rejoined — sync current board state
      sendSync({ cells, turn, gameState, winCombo });
    } else {
      // New player — reset creator's board and send fresh state
      resetGame();
      sendSync({ cells: Array(9).fill(""), turn: 0, gameState: GameState.Ongoing, winCombo: [] });
    }
  }, [memberJoined]);

  // Received sync from creator — restore board state
  useEffect(() => {
    if (!lastSync) return;
    setCells(lastSync.cells);
    setTurn(lastSync.turn);
    setGameState(lastSync.gameState);
    setWinCombo(lastSync.winCombo);
  }, [lastSync]);

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

  const applyMove = (index: number) => {
    if (gameState !== GameState.Ongoing) return;
    const updatedCells = [...cells];
    updatedCells[index] = currentTurn(turn);
    setCells(updatedCells);
    processTurn(updatedCells, turn);
  };

  const changeTurn = (index: number) => {
    if (gameState !== GameState.Ongoing) return;
    if (isOnline && !isMyTurn) return;

    const updatedCells = [...cells];
    updatedCells[index] = currentTurn(turn);
    setCells(updatedCells);

    if (isOnline) {
      sendMove(index);
      processTurn(updatedCells, turn);
      return;
    }

    if (!processTurn(updatedCells, turn)) return;

    const nextTurn = turn + 1;
    if (currentTurn(nextTurn) === CellState.O && isBotPlaying) {
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

  const changeIfBotIsPlaying = (playing: boolean) => {
    setBotIsPlaying(playing);
    resetGame();
  }

  return (
    <div className="game-container">
      <section id="header">
        <MainHeader
          currentTurn={currentTurn(turn)}
          gameState={gameState}
          isBotPlaying={isBotPlaying}
          isOnline={isOnline}
          pusherStatus={pusherStatus}
          player1Name={player1Name}
          player2Name={player2Name}
          changeIfBotIsPlaying={changeIfBotIsPlaying}
          changeIfOnline={onLeaveOnline}
          onOpenLobby={onOpenLobby}
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
                disabled={cell !== CellState.T || (isOnline && !isMyTurn)}
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
        <ActionBtn label="Reset 🖱✨" action={() => { resetGame(); if (isOnline) sendReset(); }} />
      </section>
    </div>
  );
};

export default Game;
