import { useState } from "react";
import "./App.css";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";

const App = () => {
  const [isLobbyOpen, setIsLobbyOpen] = useState<boolean>(false);
  const [online, setOnline] = useState<boolean>(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [isCreator, setIsCreator] = useState<boolean>(false);

  const handleGame = (name: string, id: string, create: boolean) => {
    setPlayerName(name);
    setRoomId(id);
    setIsCreator(create);
    setOnline(true);
    setIsLobbyOpen(false);
  };

  const handleLeaveOnline = () => {
    setOnline(false);
    setPlayerName("");
    setRoomId("");
    setIsCreator(false);
  };

  return (
    <div className="main-container">
      <Game
        onOpenLobby={() => setIsLobbyOpen(true)}
        online={online}
        onLeaveOnline={handleLeaveOnline}
        playerName={playerName}
        roomId={roomId}
        isCreator={isCreator}
      />
      <Lobby
        isOpen={isLobbyOpen}
        onClose={() => setIsLobbyOpen(false)}
        onCreateGame={handleGame}
      />
    </div>
  );
};

export default App;
