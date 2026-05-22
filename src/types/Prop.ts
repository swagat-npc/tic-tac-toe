import type { CellState, GameState } from "./State";
import type { PusherStatus } from "../hooks/usePusher";

export type MainHeaderProps = {
  currentTurn: CellState;
  gameState: GameState;
  isBotPlaying: boolean;
  isOnline: boolean;
  pusherStatus: PusherStatus;
  player1Name: string;
  player2Name: string;
  changeIfBotIsPlaying: (playing: boolean) => void;
  changeIfOnline: () => void;
  onOpenLobby: () => void;
};

export type LobbyProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: (playerName: string, roomId: string, create: boolean) => void;
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
  onLeaveOnline: () => void;
  playerName: string;
  roomId: string;
  isCreator: boolean;
};
