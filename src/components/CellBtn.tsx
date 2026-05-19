import "./CellBtn.css"
import { CellState } from "../types/CellState"
import SymbolX from "../assets/X.png"
import SymbolO from "../assets/O.png"

type CellBtnProps = {
    placement: number,
    symbol: CellState,
    disabled: boolean,
    action: (placement: number) => void
}

const CellBtn = ({ placement, symbol, disabled, action }: CellBtnProps ) => {
  const btnAction = () => {
    action(placement);
  }

  return (
    <>
      <button type="button" className="cell" onClick={btnAction} disabled={disabled}>
        {
          symbol != CellState.T && (
            <img src={ symbol == CellState.X ? SymbolX : SymbolO } alt={ symbol == CellState.X ? "X" : "O" } />
          )
        }
      </button>
    </>
  );
};

export default CellBtn;
