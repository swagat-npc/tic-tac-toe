import SymbolX from "../assets/X.png";
import SymbolO from "../assets/O.png";
import { CellState } from "../types/CellState";
import "./MainHeader.css";

type MainHeaderProps = {
  currentTurn: CellState;
};

const MainHeader = ({ currentTurn }: MainHeaderProps) => {
  return (
    <div className="main-header-container">
      <div className="title">Tic-Tac-Toe</div>
      <div className="turn-container">
        <div className={`player-turn${currentTurn == CellState.X ? " current-turn" : ""}`}>
          <img src={SymbolX} alt="X" />
          <span className="current-indicator">Current Turn</span>
        </div>
        <div className={`player-turn${currentTurn == CellState.O ? " current-turn" : ""}`}>
          <span className="current-indicator">Current Turn</span>
          <img src={SymbolO} alt="O" />
        </div>
      </div>
    </div>
  );
};

export default MainHeader;
