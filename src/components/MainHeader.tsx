import SymbolX from "../assets/X.png";
import SymbolO from "../assets/O.png";
import { CellState, GameState } from "../types/State";
import "./MainHeader.css";

type MainHeaderProps = {
  currentTurn: CellState,
  gameState: GameState
};

const MainHeader = ({ currentTurn, gameState }: MainHeaderProps) => {
  return (
    <div className="main-header-container">
      <div className="title">Tic-Tac-Toe</div>
      <div className="turn-container">
        <div className={`player-turn${currentTurn == CellState.X ? " current-turn" : ""}`}>
          <div>
            <img src={SymbolX} alt="X" />
            <div>You</div>
          </div>
          <span className="current-indicator">Current Turn</span>
        </div>
        <div className={`player-turn${currentTurn == CellState.O ? " current-turn" : ""}`}>
          <span className="current-indicator">Current Turn</span>
          <div>
            <img src={SymbolO} alt="O" />
            <div>Bot</div>
          </div>
        </div>
      </div>
      <div className={`outcome ${gameState != GameState.Ongoing ? "ended" : ""}`}>
        { gameState }
      </div>
    </div>
  );
};

export default MainHeader;
