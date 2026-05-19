import { useState } from "react"
import "./CellBtn.css"
import { CellState } from "../types/CellState"
import SymbolX from "../assets/X.png"
import SymbolO from "../assets/O.png"

type CellBtnProps = {
    symbol: CellState,
    turn: CellState
}

const CellBtn = ({ symbol, turn }: CellBtnProps ) => {
  const [mark, setMark] = useState<CellState>(symbol);

  return (
    <>
      <button type="button" className="cell" onClick={() => setMark(turn)}>
        {
          mark != CellState.T && (
            <img src={ mark == CellState.X ? SymbolX : SymbolO } alt={ mark == CellState.X ? "X" : "O" } />
          )
        }
      </button>
    </>
  );
};

export default CellBtn;
