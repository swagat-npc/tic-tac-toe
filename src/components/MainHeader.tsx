import { CellState, GameState } from "../types/State";
import "./MainHeader.css";
import ActionBtn from "./ActionBtn";
import type { MainHeaderProps } from "../types/Prop";
import PlayerTurn from "./PlayerTurn";

const MainHeader = ({
  currentTurn,
  gameState,
  isBotPlaying,
  isOnline,
  pusherStatus,
  player1Name,
  player2Name,
  changeIfBotIsPlaying,
  changeIfOnline,
  onOpenLobby,
}: MainHeaderProps) => {
  return (
    <div
      className={`main-header-container${isBotPlaying ? " singleplayer" : " multiplayer"}`}
    >
      <div className="title">Tic-Tac-Toe{isOnline && (<span className="subtitle">online</span>)}</div>
      <div className="turn-container">
        <PlayerTurn
          label={player1Name}
          symbol="X"
          align="left"
          isCurrentTurn={currentTurn === CellState.X}
        />
        <div className="mode-container">
          <div className="mode-btn">
            <ActionBtn
              label="SinglePlayer"
              action={() => changeIfBotIsPlaying(true)}
              disabled={isBotPlaying || isOnline}
              variant={true}
            />
          </div>
          <div className="mode-btn">
            <ActionBtn
              label="Local Co-op"
              action={() => changeIfBotIsPlaying(false)}
              disabled={!isBotPlaying || isOnline}
              variant={true}
            />
          </div>
          <div className="mode-btn">
            <ActionBtn
              label={isOnline ? "Leave Game" : "Multiplayer"}
              action={isOnline ? changeIfOnline : onOpenLobby}
              variant={true}
            />
          </div>
        </div>
        <PlayerTurn
          label={player2Name}
          symbol="O"
          align="right"
          isCurrentTurn={currentTurn === CellState.O}
        />
      </div>
      {isOnline && pusherStatus === "waiting" && (
        <div className="waiting-banner">Waiting for opponent to join...</div>
      )}
      <div
        className={`outcome ${gameState !== GameState.Ongoing ? "ended" : ""}`}
      >
        <span>
          {!isBotPlaying && gameState !== GameState.Tie
            ? `${gameState === GameState.Win ? player1Name : player2Name} Wins`
            : gameState}
        </span>
      </div>
    </div>
  );
};

export default MainHeader;
