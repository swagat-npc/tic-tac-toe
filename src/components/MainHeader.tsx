import SymbolX from "../assets/X.png";
import SymbolO from "../assets/O.png";
import { CellState, GameState } from "../types/State";
import "./MainHeader.css";
import ActionBtn from "./ActionBtn";

type MainHeaderProps = {
  currentTurn: CellState;
  gameState: GameState;
  mode: boolean;
  modeAction: () => void;
};

const MainHeader = ({
  currentTurn,
  gameState,
  mode,
  modeAction,
}: MainHeaderProps) => {
  return (
    <div
      className={`main-header-container${mode ? " singleplayer" : " multiplayer"}`}
    >
      <div className="title">Tic-Tac-Toe</div>
      <div className="turn-container">
        <div
          className={`player-turn${currentTurn === CellState.X ? " current-turn" : ""}`}
        >
          <div style={{ textAlign: "left" }}>
            <img src={SymbolX} alt="X" />
            <div>Player 1</div>
          </div>
          <span className="current-indicator">Current Turn</span>
        </div>
        <div className="mode-container">
          <div className="mode-btn">
            <ActionBtn
              label="SinglePlayer"
              action={modeAction}
              disable={mode}
              variant={true}
            />
          </div>
          <div className="mode-btn">
            <ActionBtn
              label="Multiplayer"
              action={modeAction}
              disable={!mode}
              variant={true}
            />
          </div>
        </div>
        <div
          className={`player-turn${currentTurn === CellState.O ? " current-turn" : ""}`}
        >
          <span className="current-indicator">Current Turn</span>
          <div style={{ textAlign: "right" }}>
            <img src={SymbolO} alt="O" />
            <div>Player 2</div>
          </div>
        </div>
      </div>
      <div
        className={`outcome ${gameState !== GameState.Ongoing ? "ended" : ""}`}
      >
        {(() => {
          if (!mode) {
            if (gameState === GameState.Tie) {
              return <span>Draw</span>              
            }
            return <span>Player {gameState === GameState.Win ? "1" : " 2" } Wins</span>;
          } 
          else return <span>{gameState}</span>;
        })()}
      </div>
    </div>
  );
};

export default MainHeader;
