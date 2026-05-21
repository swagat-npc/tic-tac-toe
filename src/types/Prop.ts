import type { CellState, GameState } from "./State";

export type MainHeaderProps = {
  currentTurn: CellState;
  gameState: GameState;
  isBotPlaying: boolean;
  isOnline: boolean;
  changeIfBotIsPlaying: (playing: boolean) => void;
  changeIfOnline: (enable: boolean) => void;
  onOpenLobby: () => void;
};

export type LobbyProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (playerName: string, roomId: string) => void;
  onJoinGame: (playerName: string, roomId: string) => void;
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

export type GameProps = {
  onOpenLobby: () => void;
  online: boolean;
  onLeaveOnline: (online: boolean) => void;
};
