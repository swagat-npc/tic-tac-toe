export const CellState = { X: "X", O: "O", T: "" } as const;
export type CellState = typeof CellState[keyof typeof CellState];