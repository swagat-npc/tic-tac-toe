import type { PlayerTurnProps } from "../types/Prop";
import SymbolX from "../assets/X.png";
import SymbolO from "../assets/O.png";
import "./PlayerTurn.css";

const PlayerTurn = ({
  label,
  symbol,
  align,
  isCurrentTurn,
}: PlayerTurnProps) => {
  return (
    <div
      className={`player-turn ${align}${isCurrentTurn ? " current-turn" : ""}`}
    >
      <div className={`symbol-container`}>
        <img src={symbol === "X" ? SymbolX : SymbolO} alt={symbol} />
        <div>{label}</div>
      </div>
      <span className="current-indicator">Current Turn</span>
    </div>
  );
};

export default PlayerTurn;
