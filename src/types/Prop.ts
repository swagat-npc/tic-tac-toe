import type { CellState, GameState } from "./State";

export type MainHeaderProps = {
  currentTurn: CellState;
  gameState: GameState;
  isBotPlaying: boolean;
  isCoOpEnabled: boolean;
  changeIfBotIsPlaying: (playing: boolean) => void;
  changeIfCoOpEnabled: (enable: boolean) => void;
};

export type PlayerTurnProps = {
  label: string;
  symbol: string;
  align: string;
  isCurrentTurn: boolean;
};

export type ActionBtnProps = {
  label: string;
  disabled?: boolean;
  variant?: boolean;
  action: () => void;
};

export type CellBtnProps = {
  placement: number;
  symbol: CellState;
  currentTurn: CellState;
  disabled: boolean;
  customClass: string;
  action: (placement: number) => void;
};
