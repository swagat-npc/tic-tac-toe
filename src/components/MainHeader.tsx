import { CellState, GameState } from "../types/State";
import "./MainHeader.css";
import ActionBtn from "./ActionBtn";
import type { MainHeaderProps } from "../types/Prop";
import PlayerTurn from "./PlayerTurn";

const MainHeader = ({
  currentTurn,
  gameState,
  mode: isSinglePlayer,
  modeAction,
}: MainHeaderProps) => {
  return (
    <div
      className={`main-header-container${isSinglePlayer ? " singleplayer" : " multiplayer"}`}
    >
      <div className="title">Tic-Tac-Toe</div>
      <div className="turn-container">
        <PlayerTurn
          label="Player 1"
          symbol="X"
          align="left"
          isCurrentTurn={currentTurn === CellState.X}
        />
        <div className="mode-container">
          <div className="mode-btn">
            <ActionBtn
              label="SinglePlayer"
              action={modeAction}
              disabled={isSinglePlayer}
              variant={true}
            />
          </div>
          <div className="mode-btn">
            <ActionBtn
              label="Multiplayer"
              action={modeAction}
              disabled={!isSinglePlayer}
              variant={true}
            />
          </div>
        </div>
        <PlayerTurn
          label="Player 2"
          symbol="O"
          align="right"
          isCurrentTurn={currentTurn === CellState.O}
        />
      </div>
      <div
        className={`outcome ${gameState !== GameState.Ongoing ? "ended" : ""}`}
      >
        <span>
          {!isSinglePlayer && gameState !== GameState.Tie
            ? `Player ${gameState === GameState.Win ? "1" : "2"} Wins`
            : gameState}
        </span>
      </div>
    </div>
  );
};

export default MainHeader;
