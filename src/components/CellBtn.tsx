import "./CellBtn.css"
import { CellState } from "../types/State"
import SymbolX from "../assets/X.png"
import SymbolO from "../assets/O.png"

type CellBtnProps = {
    placement: number,
    symbol: CellState,
    currentTurn: CellState,
    disabled: boolean,
    customClass: string,
    action: (placement: number) => void
}

const CellBtn = ({ placement, symbol, currentTurn, disabled, customClass, action }: CellBtnProps ) => {
  const btnAction = () => {
    action(placement);
  }

  return (
    <>
      <button type="button" className={`cell${" " + customClass}`} onClick={btnAction} disabled={disabled}>
        {
          symbol != CellState.T && (
            <img src={ symbol == CellState.X ? SymbolX : SymbolO } alt={ symbol == CellState.X ? "X" : "O" } />
          )
        }
        {
          symbol == CellState.T && (
            <img className="temp-turn" src={ currentTurn == CellState.X ? SymbolX : SymbolO } alt={ currentTurn == CellState.X ? "X" : "O" } />
          )
        }
      </button>
    </>
  );
};

export default CellBtn;
