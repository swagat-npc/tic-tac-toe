import { useState } from "react";
import "./App.css";
import Game from "./pages/Game";
import Lobby from "./pages/Lobby";

const App = () => {
  const [isLobbyOpen, setIsLobbyOpen] = useState<boolean>(false);
  const [online, setOnline] = useState<boolean>(false);

  const handleCreateGame = (playerName: string, roomId: string) => {
    console.log("Create game:", playerName, roomId);
    handOnline(true);
    setIsLobbyOpen(false);
  };
  
  const handleJoinGame = (playerName: string, roomId: string) => {
    console.log("Join game:", playerName, roomId);
    handOnline(true);
    setIsLobbyOpen(false);
  };
  
  const handOnline = (isOnline: boolean) => {
    setOnline(isOnline);
  }

  return (
    <div className="main-container">
      <Game onOpenLobby={() => setIsLobbyOpen(true)} online={online} onLeaveOnline={handOnline} />
      <Lobby
        isOpen={isLobbyOpen}
        onClose={() => setIsLobbyOpen(false)}
        onCreateGame={handleCreateGame}
        onJoinGame={handleJoinGame}
      />
    </div>
  );
};

export default App;
