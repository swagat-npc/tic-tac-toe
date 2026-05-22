import { useState } from "react";
import ReactDOM from "react-dom";
import ActionBtn from "../components/ActionBtn";
import type { LobbyProps } from "../types/Prop";
import "./Lobby.css";

const generateRoomId = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const Lobby = ({ isOpen, onClose, onCreateGame }: LobbyProps) => {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [generatedRoomId, setGeneratedRoomId] = useState("");
  const [view, setView] = useState<"home" | "create" | "join">("home");

  if (!isOpen) return null;

  const handleCreateClick = () => {
    setGeneratedRoomId(generateRoomId());
    setView("create");
  };

  const handleStart = () => {
    if (!playerName.trim()) return;
    onCreateGame(playerName.trim(), generatedRoomId, true);
  };

  const handleJoin = () => {
    if (!playerName.trim() || !roomId.trim()) return;
    onCreateGame(playerName.trim(), roomId.trim().toUpperCase(), false);
  };

  const handleBack = () => {
    setView("home");
    setGeneratedRoomId("");
    setRoomId("");
  };

  const handleClose = () => {
    handleBack();
    setPlayerName("");
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="lobby-overlay" onClick={handleClose}>
      <div className="lobby-modal" onClick={(e) => e.stopPropagation()}>
        <button className="lobby-close" onClick={handleClose}>✕</button>
        <h2 className="lobby-title">Online Multiplayer</h2>

        <div className="lobby-field">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
          />
        </div>

        {view === "home" && (
          <div className="lobby-actions">
            <ActionBtn label="Create Game" action={handleCreateClick} variant={true} />
            <ActionBtn label="Join Game" action={() => setView("join")} variant={true} />
          </div>
        )}

        {view === "create" && (
          <div className="lobby-section">
            <div className="lobby-room-id">
              <span>Room ID</span>
              <code>{generatedRoomId}</code>
              <button onClick={() => navigator.clipboard.writeText(generatedRoomId)}>
                Copy
              </button>
            </div>
            <p className="lobby-hint">Share this code with your friend before starting.</p>
            <div className="lobby-actions">
              <ActionBtn label="Back" action={handleBack} variant={true} />
              <ActionBtn label="Start" action={handleStart} variant={true} />
            </div>
          </div>
        )}

        {view === "join" && (
          <div className="lobby-section">
            <div className="lobby-field">
              <label>Room ID</label>
              <input
                type="text"
                placeholder="Paste room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                maxLength={6}
              />
            </div>
            <div className="lobby-actions">
              <ActionBtn label="Back" action={handleBack} variant={true} />
              <ActionBtn label="Join" action={handleJoin} variant={true} />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Lobby;
