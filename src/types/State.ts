export const CellState = { X: "X", O: "O", T: "" } as const;
export type CellState = (typeof CellState)[keyof typeof CellState];

export const GameState = {
  Win: "You Win",
  Lose: "You Lose",
  Tie: "Draw",
  Ongoing: "Ongoing",
} as const;
export type GameState = (typeof GameState)[keyof typeof GameState];
