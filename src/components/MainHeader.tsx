import { CellState, GameState } from "../types/State";
import "./MainHeader.css";
import ActionBtn from "./ActionBtn";
import type { MainHeaderProps } from "../types/Prop";
import PlayerTurn from "./PlayerTurn";

const MainHeader = ({
  currentTurn,
  gameState,
  isBotPlaying,
  isCoOpEnabled,
  changeIfBotIsPlaying,
  changeIfCoOpEnabled,
}: MainHeaderProps) => {
  return (
    <div
      className={`main-header-container${isBotPlaying ? " singleplayer" : " multiplayer"}`}
    >
      <div className="title">Tic-Tac-Toe{isCoOpEnabled && (<span className="subtitle">online</span>)}</div>
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
              action={() => changeIfBotIsPlaying(true)}
              disabled={isBotPlaying || isCoOpEnabled}
              variant={true}
            />
          </div>
          <div className="mode-btn">
            <ActionBtn
              label="Local Co-op"
              action={() => changeIfBotIsPlaying(false)}
              disabled={!isBotPlaying || isCoOpEnabled}
              variant={true}
            />
          </div>
          <div className="mode-btn">
            <ActionBtn
              label={isCoOpEnabled ? "Leave Game" : "Multiplayer"}
              action={() => changeIfCoOpEnabled(!isCoOpEnabled)}
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
          {!isBotPlaying && gameState !== GameState.Tie
            ? `Player ${gameState === GameState.Win ? "1" : "2"} Wins`
            : gameState}
        </span>
      </div>
    </div>
  );
};

export default MainHeader;
